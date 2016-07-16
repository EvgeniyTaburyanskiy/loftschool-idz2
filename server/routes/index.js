/**
 * ROUTING WORKERS
 */
var r_main = require('./main');         //-> Обработчик Маршрута Гланая стр
var r_auth = require('./auth');         //-> Обработчик Маршрута Авторизация/Регистрация/Восстановление пароля
var r_albums = require('./albums');     //-> Обработчик Маршрута Альбом редактирвание
var r_users = require('./users');       //-> Обработчик Маршрута Пользователь-Альбомы
var r_search = require('./search');     //-> Обработчик Маршрута Результаты поиска
var r_error = require('./error');       //-> Обработчик Ошибочных запросов

/**
 * 
 * @param app
 * @returns {*}
 * @private
 */
var _router = function (app) {
  var express = require('express');
  var router = express.Router();
  // ==============================================
  /**
   * HOME Routes
   */
  router.get('/', r_main.home);

  // ==============================================
  /**
   * AUTH Routes
   */
  router.post('/auth/:login', r_auth.login);
  router.post('/auth/:register', r_auth.register);
  router.post('/auth/:fogot', r_auth.fogot);

  // ==============================================
  /**
   * ALBUM Routes
   */
  router.get('/albums', r_albums.albums);

  // ==============================================

  /**
   * USERS Routes
   */
  router.get('/users', r_users.users);
  router.get('/users/:id', r_users.user);

  // ==============================================
  /**
   * SEARCH Routes
   */
  router.get('/search', r_search.search);

  // ==============================================
  /**
   * DEFAULT Routes
   */
  app.use(r_error.err_404);

  // error handlers
  if (app.get('env') === 'development') {
    // development error handler
    // will print stacktrace
    app.use(r_error.err_allDev);
  }
  else {
    // production error handler
    // no stacktraces leaked to user
    app.use(r_error.err_all);
  }

  return router;
};

module.exports = _router;
