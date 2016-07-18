var logger = require('../utils/winston')(module);
var HttpError = require('../middleware/HttpError').HttpError;
var AuthError = require('../db/schemas/User').AuthError;
var passport = require('passport');
//Конфигурируем стратегии Passport
require('../config/passportAuthConf')(passport);

var User = require('../db/models/User').mUser;

/*--------------------------------------------------------*/
/**
 * Обработчик запроса авторизации.
 */
var _login = function (req, res, next) {
  /*
   * Проводим Авторизацию через Passport и отдадим ему в качестве колбека нашу функцию.
   * Паспорт после ваторизации вернет в нашу функцию 2 параметра котрые мы може обработать по своему
   */
  passport.authenticate('local-signin',
      function (err, user, info) {
        if (err) {//-> если в процессе авторизации была Ошибка, обрабатываем ее.
          if (err instanceof AuthError) { //-> Это наша ошибка из схемы Юзера
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
          // Все ок. Отправляем на Главную
          return res.redirect('/');
        });
      }
  )(req, res, next);
};

var _logout = function (req, res, next) {
  req.logout();          //-> метод добавляется модулем passport. http://passportjs.org/docs/logout
  //(согласно доке passport удаляет свои данные из сессии, но объект сессии нет.)
  req.session.destroy(); //-> Удаляем сессию пользователя
  res.redirect('/auth'); //-> Редиректим на страницу авторизации
};

var _register = function (req, res, next) {
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
              logger.info("Ошибка валидации Email пользователя. %s", err.errors.emailAddress);
              errMsgList.push(err.errors.emailAddress.message);
            }

            if (err.errors.password) {
              logger.info("Ошибка валидации пароля пользователя. %s", err.errors.password);
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
          // Все ок. Отправляем на Главную
          return res.redirect('/');
        });
      }
  )(req, res, next);


  User.register(username, password, function (err, user) {

  });
};

var _fogot = function (req, res, next) {
  var resData = {
    "action": req.params.action,
    "req":    req.body
  };
  // for AJAX response JSON -----------------------
  if (req.xhr) {
    res.json(resData)
  }
  // NO AJAX response clear Data -----------------------
  else {
    res.send(resData);
  }


  //res.render('index', {title: 'fogot'});
};

var getAuth = function (req, res, next) {
  res.render(
      'auth',
      {title: 'getAuth'}
  );
};


module.exports.get = getAuth;

module.exports.post = {
  signin:  _login,
  signout: _logout,
  signup:  _register,
  fogot:   _fogot
};

