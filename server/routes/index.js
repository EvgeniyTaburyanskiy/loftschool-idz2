/**
 * Module dependencies.
 */
var logger = require('../utils/winston')(module);
var HttpError = require('../utils/error').HttpError;
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
  var router = require('express').Router();

  router.use(function Logger(req, res, next) {
    var sess = req.session;
    sess.numOfVisits = sess.numOfVisits + 1 || 1;
    //logger.debug(sess);
    next();
  });

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
   * DEFAULT  Route 404
   */
  router.use(controllers.error.err_404);

  // error handlers
  router.use(controllers.error.err_all);

  return router;
};

module.exports = _router;
