var logger = require('../../utils/winston')(module);
var config = require('../../utils/nconf');
var HttpError = require('../../middleware/HttpError').HttpError;
var AuthError = require('../../db/schemas/User').AuthError;
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var passport = require('passport');
//Конфигурируем стратегии Passport
require('../../config/passportAuthConf')(passport);

var User = require('../../db/models/User').mUser;

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
          res.json(
              {
                staus: 200
              }
          )
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
            if (err.errors.emailAddress) {
              logger.info("Ошибка валидации Email пользователя. %s", err.errors.emailAddress.message);
              errMsgList.push(err.errors.emailAddress.message);
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
          // Все ок. Отправляем Ответ со статусом
          res.json(
              {
                staus: 200
              }
          )
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
  res.json(
      {
        staus: 200
      }
  ); //-> Отдаем ответ о результате!
};

/**
 * Обрабатывает форму запроса на смену пароля.
 * @param req
 * @param res
 * @param next
 */
var api_postfogot = function (req, res, next) {
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
}
/**
 *
 * @param req
 * @param res
 * @param next
 * @private
 */
var api_passwdReset = function (req, res, next) {

};

/**
 *
 * @param req
 * @param res
 * @param next
 */
var getAuth = function (req, res, next) {
  res.render(
      'auth',
      {title: 'getAuth'}
  );
};

exports = module.exports = {
  api_signin:    api_signin,
  api_signout:   api_signout,
  api_signup:    api_signup,
  api_postfogot: api_postfogot
};

