var logger = require('../utils/winston')(module);
var authAPI = require('./api/auth');
var config = require('../utils/nconf');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var HttpError = require('../middleware/HttpError').HttpError;
var AuthError = require('../db/schemas/User').AuthError;
var passport = require('passport');
//Конфигурируем стратегии Passport
require('../config/passportAuthConf')(passport);

var User = require('../db/models/User').mUser;

/*--------------------------------------------------------*/
/**
 * Выход с Сайта и редирект на Авторизацию
 * @param req
 * @param res
 */
var signout = function (req, res) {

  req.logout();          //-> метод добавляется модулем passport. http://passportjs.org/docs/logout
  //(согласно доке passport удаляет свои данные из сессии, но объект сессии нет.)
  req.session.destroy(); //-> Удаляем сессию пользователя
  res.redirect('/auth'); //-> Редиректим на страницу авторизации
};


/**
 * Выдает страницу с формами для (Авторизации)
 * Вход на сайт (авторизация)
 * @param req
 * @param res
 */
var signin = function (req, res) {
  res.render(
      'auth',
      {
        title:     'Login',
        csrfToken: req.csrfToken()
      }
  );
};


/**
 * Отдает страницу с форммой запроса смены пароля ( по email)
 * @param req
 * @param res
 */
var getFogot = function (req, res) {
  res.render(
      'fogot_passwd',
      {
        title:     'Fogot Password',
        csrfToken: req.csrfToken()
      }
  );
};

/**
 *
 * @param req
 * @param res
 * @param next
 */
var postFogot = function (req, res, next) {
  var email = req.body.email;

  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      User.findOne({'userdata.emailAddress': email}, function (err, user) {
        if (!user) {
          req.flash('error', 'Пользователь с указанным E-mail не существует');
          return done(new HttpError(400, 'ILLEGAL_PARAM_VALUE', 'Пользователь с указанным E-mail не существует'));
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function (err) {
          return done(err, token, user);
        });
      });
    },
    function (token, user, done) {
      var mailTransporter = nodemailer.createTransport(config.get('nodemailer:transport'));
      // TODO:  -шаблоны писем https://github.com/nodemailer/nodemailer#using-templates
      var mailOptions = {
        to:      user.userdata.emailAddress,
        from:    config.get('nodemailer:mailOptions:from'),
        subject: 'LOFTOGRAM: Восстановление пароля!',
        text:    'Вы получили это письмо потому, что Вы (либо кто-то другой) отправил запрос на смену пароля для' +
                 ' доступа к  Вашему аккаунту.\n\n' +
                 'Пожалуйста перейдите по следующей сслыке, либо скопирйте и вставьте ее в адресную строку вашего' +
                 ' браузера что бы завершить процесс смены пароля:\n\n' +
                 'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                 'Ссылка действительна в течение 1-го Часа. \n\n' +
                 'Если Вы не отправляли подобный запрос, то не обращайте внимания на это письмо.\n'
      };

      mailTransporter.sendMail(mailOptions, function (err, info) {
        return done(err, 'Success');
      });
    }
  ], function (err, result) {
    if (err) return res.status(400).redirect('back');
    //Все Ок. Токен сгенерен, письмо отправлено.
    // TODO:  -Выдавать ошибки и Сообщения через отдельный модуль.по Кодам
    req.flash('success', 'На ваш E-mail было отправлено письмо с инструкциями!.');
    res.status(200).redirect('back')
  });
};


/**
 * Отдает страницу с формой для ввода новогопароля пароля
 * Сброс пароля
 * @param req
 * @param res
 */
var getReset = function (req, res) {
  res.render(
      'reset_passwd',
      {
        title:     'Fogot Password',
        csrfToken: req.csrfToken()
      }
  );
};

/**
 * Обрабатывает форму смены пароля и Меняет пароль для пользователя с правильным Токеном
 * После успешной смены пароля высылаает уведомление на емайл.
 *
 * @param req
 * @param res
 */
var postReset = function (req, res) {
  async.waterfall([
        // Ищем пользователя с токеном и меняем пароль
        function (done) {
          User.findOne({
            'resetPasswordToken':   String(req.params.token),
            'resetPasswordExpires': {$gt: new Date}
          }, done)
        },
        // Пользователя нашли! Пытаемся установить пароль,
        function (user, done) {
          if (!user) {
            // TODO: -Выдать сообщение что пароль не удалось сменить из-за не действительнго токена или истекшего срока его действия
            req.flash('error', 'Пароль не удалось сменить из-за не действительнго токена или истекшего срока его действия');
            return res.status(400).redirect('back');
          }
          // Меняем пароль
          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function (err) {
            if (err) {
              logger.debug('Ошибка при сохранении пользователя - ', err.message);
              // В процессе сохранения данных была ошибка. Если Ошибка с Валидацией. Обработаем ее
              if (err.name === 'ValidationError') {//-> Это наша ошибка Валидации данных из Mongoose
                var errMsgList = [];

                if (err.errors.emailAddress) {
                  logger.info("Ошибка валидации Email пользователя: %s", err.errors.emailAddress.message);
                  req.flash('error', err.errors.emailAddress.message);
                  errMsgList.push(err.errors.emailAddress.message);
                }

                if (err.errors.password) {
                  logger.info("Ошибка валидации пароля пользователя: %s", err.errors.password.message);
                  req.flash('error', err.errors.password.message);
                  errMsgList.push(err.errors.password.message);
                }
              }

              return done(err);
            }
            //Сохранение прошло успешно. Есть Объект пользователя. Отдаем его в login фунцию которую навешивает  Passport
            req.login(user, function (err) {
              //если в процессе логина поймали ошибку отдаем ее в наш обработчик
              return done(err, user);
            });
          });
        },
        // Если со сменой пароля небыло проблем , отпарвляем письмо подтверждение
        function (user, done) {
          var mailTransporter = nodemailer.createTransport(config.get('nodemailer:transport'));

          // TODO:  -шаблон писема подтверждения сброса пароля https://github.com/nodemailer/nodemailer#using-templates
          var mailOptions = {
            to:      user.userdata.emailAddress,
            from:    config.get('nodemailer:mailOptions:from'),
            subject: 'LOFTOGRAM: Ваш Пароль был изменен!',
            text:    'Здравствуйте,\n\n' +
                     'Пароль вашего аккаунта с E-mail: ' + user.userdata.emailAddress + ' был успешно изменен!'
          };

          mailTransporter.sendMail(mailOptions, function (err, info) {
            if (err) return done(err);
            // TODO:  - инфо о том что письмо отправлено на указанный емайл
            req.flash('success', 'Ваш Пароль успешно изменен!.');
            return done(err, 'Success');
          });
        }
      ],
      // Все ок. Отправляем на Главную
      // Все не ОК  Возвращаем на туде страницу с ошибками
      function (err, result) {
        // TODO:  -Выдавать ошибки и Сообщения через отдельный модуль.по Кодам
        if (err) return res.status(400).redirect('back');
        res.status(200).redirect('/')
      });
};


exports = module.exports = {
  signin:    signin,
  signout:   signout,
  getfogot:  getFogot,
  postfogot: postFogot,
  getreset:  getReset,
  postreset: postReset
};

