var logger = require('../utils/winston')(module);
var async = require('async');
var HttpError = require('../utils/HttpError').HttpError;
var AuthError = require('../db/schemas/User').AuthError;


var User = require('../db/models/User').mUser;

/*--------------------------------------------------------*/
/**
 * Обработчик запроса авторизации. (выполняем после авторизации passport)
 * @param req
 * @param res
 * @param next
 * @private
 */
var _login = function (req, res, next) {

};

var _logout = function (req, res, next) {
  req.logout();          //-> метод добавляется модулем passport. http://passportjs.org/docs/logout
  //(согласно доке passport удаляет свои данные из сессии, но объект сессии нет.)
  req.session.destroy(); //-> Удаляем сессию пользователя
  res.redirect('/auth'); //-> Редиректим на страницу авторизации
};

var _register = function (req, res, next) {
  var
      password = req.body.password,
      email    = req.body.email;

  User.register(email, password, function (err, user) {
    if (err) {//-> если в процессе регистрации была Ошибка, обрабатываем ее.
      if (err instanceof AuthError) { //-> Это наша ошибка из схемы Юзера
        return next(new HttpError(403, err.message)); //-> обрабатываем ее так как нам нужно. Например возвращаем 403
      }
      else {//-> Это ошибка не нами сгенерена , отдаем ее express
        return next(err);
      }
    }

    /* Выполняем автологон для только что сгенерированного пользователя, редиректим на главную
     * метод req.login() добавляется  модулем passport. http://passportjs.org/docs/login
     * Passport его автоматически использует при каждом вызове passport.authenticate()
     **/

    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  });
};

var _fogot = function (req, res, next) {
  res.send({
    "action": req.params.action,
    "req":    req.body
  });

  //res.render('index', {title: 'fogot'});
};

var getAuth = function (req, res, next) {
  res.render('auth', {title: 'getAuth'});
};


module.exports.get = getAuth;
module.exports.post = {
  login:    _login,
  logout:   _logout,
  register: _register,
  fogot:    _fogot
};

