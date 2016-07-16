/**
 * ROUTING CONTROLLERS
 */
var controllers = {
  main:   require('./main'),         //-> Обработчик Маршрута Гланая стр
  auth:   require('./auth'),         //-> Обработчик Маршрута Авторизация/Регистрация/Восстановление пароля
  albums: require('./albums'),       //-> Обработчик Маршрута Альбом редактирвание
  users:  require('./users'),        //-> Обработчик Маршрута Пользователь-Альбомы
  search: require('./search'),       //-> Обработчик Маршрута Результаты поиска
  error:  require('./error')         //-> Обработчик Ошибочных запросов
};


/**
 * Router Wrapper
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
  router.get('/', controllers.main.home);

  // ==============================================
  /**
   * AUTH Routes
   */
  router.post('/auth/:login', controllers.auth.login);
  router.post('/auth/:register', controllers.auth.register);
  router.post('/auth/:fogot', controllers.auth.fogot);

  // ==============================================
  /**
   * ALBUM Routes
   */
  router.get('/albums', controllers.albums.albums);

  // ==============================================

  /**
   * USERS Routes
   */
  router.get('/users', controllers.users.users);
  router.get('/users/:id', controllers.users.user);

  // ==============================================
  /**
   * SEARCH Routes
   */
  router.get('/search', controllers.search.search);

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
