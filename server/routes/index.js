/**
 * Промежуточный обработчик уровня маршрутизатора
 * Обрабатывает маршруты
 */

/**
 * Module dependencies.
 */
var logger = require('../utils/winston')(module);
var HttpError = require('../utils/HttpError').HttpError;
var checkAuth = require('../middleware/checkAuth');

var passport = require('passport');
var passportConf = require('../config/passportAuthConf');

/**
 * Router
 * @param app
 * @returns {*}
 * @private
 */
var _router = function (app) {
  var router = require('express').Router();
  /**
   * ROUTING CONTROLLERS
   */
  var controllers = {
    main:   require('./main'),         //-> Обработчик Маршрута Гланая стр
    auth:   require('./auth'),         //-> Обработчик Маршрута Авторизация/Регистрация/Восстановление пароля
    albums: require('./albums'),       //-> Обработчик Маршрута Альбом
    users:  require('./users'),        //-> Обработчик Маршрута Пользователь
    search: require('./search'),       //-> Обработчик Маршрута Поиска
    error:  require('./error')         //-> Обработчик Ошибочных запросов
  };

  router.use(function Logger(req, res, next) {
    var sess = req.session;
    sess.numOfVisits = sess.numOfVisits + 1 || 1;
    next();
  });

  // ==============================================
  /**
   * HOME Routes
   */
  router.get('/', checkAuth, controllers.main.home);

  // ==============================================
  /**
   * AUTH Routes
   */
  router.get('/auth', controllers.auth.get);

  router.post('/auth/login',
      passport.authenticate('local'),
      controllers.auth.post.login
  );
  router.get('/auth/logout', controllers.auth.post.logout);
  router.post('/auth/logout', controllers.auth.post.logout);
  router.post('/auth/register', controllers.auth.post.register);
  router.post('/auth/fogot', controllers.auth.post.fogot);
  // ==============================================
  /**
   * ALBUM Routes
   */
  router.get('/albums', checkAuth, controllers.albums.albums);

  // ==============================================
  /**
   * USERS Routes
   */
  router.get('/users', checkAuth, controllers.users.users);
  router.get('/users/:id', checkAuth, controllers.users.user);

  // ==============================================
  /**
   * SEARCH Routes
   */

  router.get('/search', checkAuth, controllers.search.search);

  // ==============================================
  /**
   * DEFAULT  Route 404
   */
  router.use(controllers.error.err_404);

  // error handlers
  router.use(controllers.error.err_all);

  return router;
};

module.exports.Router = _router;
