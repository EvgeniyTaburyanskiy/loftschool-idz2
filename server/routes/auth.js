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
          return next(new HttpError(400, 'ILLEGAL_PARAM_VALUE', 'Пользователь с указанным Email не существует'));
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function (err) {
          done(err, token, user);
        });
      });
    },
    function (token, user, done) {
      var mailTransporter = nodemailer.createTransport(config.get('nodemailer:transport'));
      // TODO: API -текст письма нужно на русском
      // TODO: API -шаблоны писем https://github.com/nodemailer/nodemailer#using-templates
      var mailOptions = {
        to:      user.userdata.emailAddress,
        from:    config.get('nodemailer:mailOptions:from'),
        subject: 'Loftogram: Восстановление пароля!',
        text:    'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                 'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                 'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                 'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };

      mailTransporter.sendMail(mailOptions, function (err, info) {
        if (err) return done(err);
        // TODO: API -JSON инфо о том что письмо отправлено на указанный емайл
        console.log('Message sent: ' + info.response);
        return done(err, 'done');
      });
    }
  ], function (err, result) {
    if (err) return next(err);
    //Все Ок. Токен сгенерен, письмо отправлено.
    // TODO: API -Сформировать объект ответа JSON по Восстановлению пароля
    res.json(
        {
          status: 200
        }
    );
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
                resetPasswordToken:   req.params.token,
                resetPasswordExpires: {$gt: Date.now()}
              },
              function (err, user) {
                console.log(err);
                if (!user) {
                  // TODO: -Выдать сообщение что пароль не удалось сменить из-за не действительнго токена или истекшего срока его действия
                  return res.redirect('back');
                }
                // Меняем пароль
                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function (err) {
                  if (err) return done(err);
                  //Сохранение прошло успешно. Есть Объект пользователя. Отдаем его в login фунцию которую навешивает
                  // Passport
                  req.login(user, {}, function (err) {
                    //если в процессе логина поймали ошибку отдаем ее в наш обработчик
                    if (err) {
                      return done(err);
                    }
                    done(err, user);
                  });
                });
              });
        },
        // Если пролем со сменой пароля небыло , отпарвляем письмо подтверждение
        function (user, done) {
          var smtpTransport = nodemailer.createTransport('SMTP', {
            service: 'SendGrid',
            auth:    {
              user: '!!! YOUR SENDGRID USERNAME !!!',
              pass: '!!! YOUR SENDGRID PASSWORD !!!'
            }
          });
          var mailOptions = {
            to:      user.email,
            from:    'passwordreset@demo.com',
            subject: 'Your password has been changed',
            text:    'Hello,\n\n' +
                     'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
          };
          smtpTransport.sendMail(mailOptions, function (err) {
            req.flash('success', 'Success! Your password has been changed.');
            done(err);
          });
        }
      ],
      // Все ок. Отправляем на Главную
      function (err) {
        res.redirect('/');
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

