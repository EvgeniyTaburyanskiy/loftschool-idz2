var logger = require('../../utils/winston')(module);
var authAPI = require('././auth');
var config = require('../../utils/nconf');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var HttpError = require('../../middleware/HttpError').HttpError;
var AuthError = require('../../db/schemas/User').AuthError;
var passport = require('passport');
var mail = require('../../utils/mail');
require('../../config/passportAuthConf')(passport);//Конфигурируем стратегии Passport


var User = require('../../db/models/User').mUser;

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
 * Выдает страницу с формами для (Авторизации/Регистрации/Восстановления пароля)
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
 * Переадресовываем на сраницу Авторизации (там форма смены пароля)
 * @param req
 * @param res
 */
var getFogot = function (req, res) {
  res.status(301).redirect('/auth');
};


/**
 * Отдает страницу с формой для ввода нового пароля пароля
 * Сброс пароля
 * @param req
 * @param res
 */
var getReset = function (req, res) {
  res.render(
      'reset',
      {
        title:     'Fogot Password',
        csrfToken: req.csrfToken(),
        token:     req.params.token
      }
  );
};


/**
 * Обрабатывает пользователя с правильным Токеном Подтверждения Email
 *
 * @param req
 * @param res
 * @param next
 * @private
 */
var confirmEmail = function (req, res, next) {
  var token = req.query.token || req.params.token;

  async.waterfall([
        // Ищем пользователя с токеном и меняем пароль
        function (done) {
          User
          .findOne({
            'emailConfirmationToken': String(token),
            'emailConfirmed':         false
          }, done)
        },
        // Пользователя нашли! Пытаемся внести изменения в Карточку пользователя - БД,
        function (user, done) {
          if (!user) {
            return next(new HttpError(400, 'ILLEGAL_PARAM_VALUE', 'Подтверждение не состоялось. Токен не действительный'));
          }
          // Меняем пароль
          user.emailConfirmationToken = undefined;
          user.emailConfirmed = true;

          user.save(function (err) {
            if (err) {
              logger.debug('Ошибка при сохранении пользователя - ', err.message);
              // В процессе сохранения данных была ошибка. Если Ошибка с Валидацией. Обработаем ее
              if (err.name === 'ValidationError') {//-> Это наша ошибка Валидации данных из Mongoose
                var errMsgList = [];

                if (err.errors.email) {
                  logger.info("Ошибка валидации Email пользователя: %s", err.errors.email.message);
                  errMsgList.push(err.errors.email.message);
                }

                if (err.errors.password) {
                  logger.info("Ошибка валидации пароля пользователя: %s", err.errors.password.message);
                  errMsgList.push(err.errors.password.message);
                }
              }

              return errMsgList.length ?
                  new HttpError(400, 'ILLEGAL_PARAM_VALUE', errMsgList) :
                  done(err);
            }
            //Сохранение прошло успешно. Есть Объект пользователя. Отдаем его в login фунцию которую навешивает  Passport
            req.login(user, function (err) {
              //если в процессе логина поймали ошибку отдаем ее в обработчик
              return done(err, user);
            });
          });
        },
        // Отправляем Велоком письмо
        function (user, done) {
          var mailOptions = {
            to:      user.userdata.email,
            subject: 'Добро пожаловать!',
            text:    'Мы очень рады, что Вы решили попробовать Loftogram!\n\n' +
                     'Теперь Вы можете воспользоваться всеми преимуществами нашего сервиса.\n\n' +
                     'Предлагаем вам заполнить карточку пользователя и начать делиться впечатлениями. \n\n' +
                     'Не отвечайте на это сообщение.\n' +
                     'Приятного обмена впечатлениями!'
          };

          mail(mailOptions, function (err, info) {
            if (err) return done(err);
            return done(err, 'Success');
          });
        }
      ],
      // Все ок. Отправляем на Главную
      // Все не ОК  Возвращаем на туде страницу с ошибками
      function (err, result) {
        if (err) return next(err);
        req.flash('success', 'Ваш E-mail Успешно подтвержден!');
        res.status(200).redirect('/');
      });
};


exports = module.exports = {
  signin:       signin,
  signout:      signout,
  getFogot:     getFogot,
  getReset:     getReset,
  confirmEmail: confirmEmail
};

