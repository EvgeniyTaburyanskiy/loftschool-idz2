var logger = require('../../../utils/winston')(module);
var config = require('../../../utils/nconf');
var HttpError = require('../../../middleware/HttpError').HttpError;
var AuthError = require('../../../db/schemas/User').AuthError;

var async = require('async');
var crypto = require('crypto');
var passport = require('passport');
var mail = require('../../../utils/mail');

//Конфигурируем стратегии Passport
require('../../../config/passportAuthConf')(passport);

var User = require('../../../db/models/User').mUser;

/*--------------------------------------------------------*/
/**
 * Обработчик запроса авторизации.
 *
 * Проводим Авторизацию через Страгеию 'local-signin' Passport и отдадим ему в качестве колбека нашу функцию.
 * Паспорт после ваторизации вернет в нашу функцию Юзера и Информацию об ошиках если они были, котрые мы може
 * обработать по своему
 */
var api_signin = function (req, res, next) {
  passport.authenticate('local-signin',
      function (err, user, info) {
        if (err) {//-> если в процессе авторизации была Ошибка, обрабатываем ее.
          if (err instanceof AuthError) {
            //Такого пользователя не существует
            //Вы ввели неверный пароль
            return next(new HttpError(400, 'ILLEGAL_PARAM_VALUE', err.message));
          }
          else {//-> Это ошибка не нами сгенерена , отдаем ее express
            return next(err);
          }
        }
        // Авторизация прошла успешно. Есть Объект пользователя. Отдаем его в login фунцию которую навешивает Passport
        req.login(user, {}, function (err) {
          if (err) {
            //если в процессе логина поймали ошибку отдаем ее в наш обработчик
            return next(new HttpError(500, null, err.message));
          }

          // TODO: API- статус ответа в API для успешной авторизации
          // Все ок. Отправляем Ответ со статусом
          next(new HttpError(200, null, 'Добро пожаловать в Loftogram!'));
        });
      }
  )(req, res, next);
};


/**
 * Обработчик Запроса Регистрации нового пользователя.
 * Проводим Регистрацию через Страгеию 'local-signup'Passport и отдадим ему в качестве колбека нашу функцию.
 * Паспорт после ваторизации вернет в нашу функцию Юзера и Информацию об ошиках если они были, котрые мы може
 * обработать по своему
 * @param req
 * @param res
 * @param next
 * @private
 */
var api_signup = function (req, res, next) {
  passport.authenticate('local-signup',
      function (err, user, info) {
        if (err) {//-> если в процессе регистрации была Ошибка, обрабатываем ее.
          if (err instanceof AuthError) { //-> Это наша ошибка из схемы Юзера
            //Имя пользователя уже занято
            return next(new HttpError(400, 'ILLEGAL_PARAM_VALUE', err.message)); //-> обрабатываем ее так как нам нужно.
          }
          else if (err.name === 'ValidationError') {//-> Это наша ошибка Валидации данных из Mongoose
            var errMsgList = [];
            if (err.errors.email) {
              logger.info("Ошибка валидации Email пользователя. %s", err.errors.email.message);
              errMsgList.push(err.errors.email.message);
            }

            if (err.errors.password) {
              logger.info("Ошибка валидации пароля пользователя. %s", err.errors.password.message);
              errMsgList.push(err.errors.password.message);
            }

            return errMsgList.length ?
                next(new HttpError(400, 'ILLEGAL_PARAM_VALUE', errMsgList)) :
                next(new HttpError(500));
          }
          else {//-> Это ошибка не нами сгенерена и не результат Валидации Mongoose, отдаем ее express
            return next(err);
          }
        }
        /*
         *  TODO: - Генерация Токена подтверждения регистрации
         *  TODO: - Создание письма и отправка пользователю для подтверждения регстрации
         *  TODO: - Логику обработки результата подтверждения
         */

        var mailOptions = {
          to:      user.userdata.email,
          subject: 'Подтверждение E-mail!',
          text:    'Мы очень рады, что Вы решили попробовать Loftogram!\n\n' +
                   'Прежде чем Вы сможете начать обмениваться впечатлениями. Мы просим Вас подтвердить ваш E-mail\n\n' +
                   'Для этого Вам всего лишь нужно перейти по указанной ссылке: \n\n' +
                   'http://' + req.headers.host + '/email.confirm/' + user.emailConfirmationToken + '\n\n' +
                   'Акаунт необходимо подтвердить в течение 2 дней. Иначе сервис отставляет за собой право его' +
                   ' заблокировать! \n' +
                   'Не отвечайте на это сообщение.\n'

        };

        mail(mailOptions, function (err, info) {
          if (err) return next(err);
        });

        /*
         * Выполняем автологон для только что сгенерированного пользователя, редиректим на главную
         * метод req.login() добавляется  модулем passport. http://passportjs.org/docs/login
         */
        req.login(user, function (err) {
          if (err) {
            //если в процессе логина поймали ошибку отдаем ее в наш обработчик
            return next(new HttpError(500, null, err.message));
          }
          // TODO: API- статус ответа в API для успешной регистрации
          // Все ок.
          next(new HttpError(200, null, 'Вам было отправлено письмо для подтверждения E-mail.'))
        });
      }
  )(req, res, next);
};


/**
 * Обрабатывает запрос выхода из системы.\
 * Разлогонивает пользователя и возвращает Статус "Ок".
 * @param req
 * @param res
 * @param next
 * @private
 */
var api_signout = function (req, res, next) {
  req.logout();          //-> метод добавляется модулем passport. http://passportjs.org/docs/logout
  //(согласно доке passport удаляет свои данные из сессии, но объект сессии нет.)
  req.session.destroy(); //-> Удаляем сессию пользователя
  // TODO: API- статус ответа в API для успешного разлогона
  next(new HttpError(200, null, ''));//-> Отдаем ответ о результате!
};


/**
 * Обрабатывает форму запроса на смену пароля.
 * @param req
 * @param res
 * @param next
 */
var api_fogotPasswd = function (req, res, next) {
  var email = req.body.email;

  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      User
      .findOne({'userdata.emailAddress': email},
          function (err, user) {
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
      var mailOptions = {
        to:      user.userdata.email,
        subject: 'Восстановление пароля!',
        text:    'Вы получили это письмо потому, что Вы (либо кто-то другой) отправил запрос на смену пароля для' +
                 ' доступа к  Вашему аккаунту.\n\n' +
                 'Пожалуйста перейдите по следующей сслыке, либо скопирйте и вставьте ее в адресную строку вашего' +
                 ' браузера что бы завершить процесс смены пароля:\n\n' +
                 'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                 'Ссылка действительна в течение 1-го Часа. \n\n' +
                 'Если Вы не отправляли подобный запрос, то не обращайте внимания на это письмо.\n'
      };

      mail(mailOptions, function (err, info) {
        return done(err, info);
      });

    }
  ], function (err, result) {
    if (err) return next(err);
    //Все Ок. Токен сгенерен, письмо отправлено.
    // TODO: API- Сформировать объект ответа JSON по Восстановлению пароля
    next(new HttpError(200, null, 'На Ваш e-mail было отправлено письмо с инструкциями!', null));
  });
};


/**
 * Обрабатывает форму смены пароля и Меняет пароль для пользователя с правильным Токеном
 * После успешной смены пароля высылаает уведомление на емайл.
 *
 * @param req
 * @param res
 * @param next
 * @private
 */
var api_resetPasswd = function (req, res, next) {

  async.waterfall([
        // Ищем пользователя с токеном и меняем пароль
        function (done) {
          User
          .findOne({
            'resetPasswordToken':   String(req.body.token),
            'resetPasswordExpires': {$gt: new Date}
          }, done)
        },
        // Пользователя нашли! Пытаемся установить пароль,
        function (user, done) {
          if (!user) {
            return next(new HttpError(400, 'ILLEGAL_PARAM_VALUE', 'Пароль не удалось сменить из-за не действительнго токена или истекшего срока его действия'));
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
              //если в процессе логина поймали ошибку отдаем ее в наш обработчик
              return done(err, user);
            });
          });
        },
        // Если со сменой пароля небыло проблем , отправляем письмо подтверждение
        function (user, done) {

          var mailOptions = {
            to:      user.userdata.email,
            subject: 'Ваш Пароль был изменен!',
            text:    'Здравствуйте,\n\n' +
                     'Пароль вашего аккаунта с E-mail: ' + user.userdata.email + ' был успешно изменен!'
          };

          mail(mailOptions, function (err, info) {
            if (err) return next(err);
            return done(err, 'Success');
          });
        }
      ],
      // Все ок. Отправляем на Главную
      // Все не ОК  Возвращаем на туде страницу с ошибками
      function (err, result) {
        if (err) return next(err);
        next(new HttpError(200, null, 'Ваш Пароль успешно изменен!', null));
      });
};


exports = module.exports = {
  api_signin:      api_signin,
  api_signout:     api_signout,
  api_signup:      api_signup,
  api_fogotPasswd: api_fogotPasswd,
  api_resetPasswd: api_resetPasswd
};

