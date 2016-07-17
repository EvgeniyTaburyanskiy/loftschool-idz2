var logger = require('../utils/winston')(module);
var async = require('async');
var HttpError = require('../utils/error').HttpError;
var AuthError = require('../db/schemas/User').AuthError;


var User = require('../db/models/User');

/*--------------------------------------------------------*/
var _login = function (req, res, next) {
  let {
          password: password,
          email: email
      } = req.body;


  User.authorise(email, password, function (err, user) {
    if (err) {//-> если в процессе авторзации была Ошибка, обрабатываем ее.
      if (err instanceof AuthError) { //-> Это наша ошибка из схемы Юзера
        return next(new HttpError(403, err.message)); //-> обрабатываем ее так как нам нужно. Например возвращаем 403
      }
      else {//-> Это ошибка не нами сгенерена , отдаем ее express
        return next(err);
      }
    }

    // Ошибок небыло.
    // Пишем в Сессию ID пользователя. Чтобы потом его легко находить  и связанные с ним данные
    req.session.user = user._id;

    // Редиректим на главную страницу.
    res.redirect('/');
  });
};

var _logout = function (req, res) {
  req.session.destroy(); //-> Удаляем сессию пользователя
  req.redirect('/auth'); //-> Редиректим на страницу авторизации
};

var _register = function (req, res, next) {
  let {
          password: password,
          email: email
      } = req.body;

  User.register(email, password, function (err, user) {
    if (err) {//-> если в процессе регистрации была Ошибка, обрабатываем ее.
      if (err instanceof AuthError) { //-> Это наша ошибка из схемы Юзера
        return next(new HttpError(403, err.message)); //-> обрабатываем ее так как нам нужно. Например возвращаем 403
      }
      else {//-> Это ошибка не нами сгенерена , отдаем ее express
        return next(err);
      }
    }

    // Ошибок небыло.
    // Пишем в Сессию ID пользователя. Чтобы потом его легко находить  и связанные с ним данные
    req.session.user = user._id;

    // Редиректим на главную страницу.
    res.redirect('/');
  });
};

var _fogot = function (req, res) {
  res.send({
    "action": req.params.action,
    "req":    req.body
  });

  //res.render('index', {title: 'fogot'});
};

var getAuth = function (req, res) {
  res.render('auth', {title: 'getAuth'});
};

var postAuth = function (req, res, next) {
  var action = req.params.action;
  logger.debug('Param = %s', req.params);

  if (action === 'login') {
    _login(req, res, next);
  } else if (action === 'logout') {
    _logout(req, res, next);
  } else if (action === 'register') {
    _register(req, res, next);
  } else if (action === 'fogot') {
    _fogot(req, res, next);
  }
  next();
};

module.exports = {
  get:  getAuth,
  post: postAuth
};
