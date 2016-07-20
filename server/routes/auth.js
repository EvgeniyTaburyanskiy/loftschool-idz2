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
      'reset_passwd',
      {
        title:      'Fogot Password',
        csrfToken:  req.csrfToken(),
        token: req.params.token
      }
  );
};


exports = module.exports = {
  signin:   signin,
  signout:  signout,
  getfogot: getFogot,
  getreset: getReset
};

