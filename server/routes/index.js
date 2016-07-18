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
var loadUser = require('../middleware/loadUser');

/**
 * Router
 * @param app
 * @returns {*}
 * @private
 */
var _router = function (app, passport) {
  //Конфигурируем стратегии Passport
  require('../config/passportAuthConf')(passport);
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
    next();
  });

  // ==============================================
  /**
   * HOME Routes
   */
  router.all('/', checkAuth);

  router.get('/', loadUser, controllers.main.home);

  // ==============================================
  /**
   * AUTH Routes
   */
  router.get('/auth', controllers.auth.get);

  router.post('/auth/signin',
      passport.authenticate('local-signin', {
        successRedirect: '/users',
        failureRedirect: '/auth',
        failureFlash:    true
      }),
      controllers.auth.post.signin); //-> Вход в Систему

  router.get('/auth/signout', controllers.auth.post.signout);//-> Выход из Системы
  router.post('/auth/signout', controllers.auth.post.signout);//-> Выход из Системы


  router.post('/auth/signup', controllers.auth.post.signup); //-> Регистрация

  router.post('/auth/fogot', controllers.auth.post.fogot); //-> Восстановление пароля
  // ==============================================
  /**
   * ALBUM Routes
   */
  router.all('/albums', checkAuth);
  router.all('/albums/*', checkAuth);

  router.get('/albums', controllers.albums.albums);

  // ==============================================
  /**
   * USERS Routes
   */
  router.all('/users', checkAuth);
  router.all('/users/*', checkAuth);

  router.get('/users', controllers.users.users);
  router.get('/users/:id', controllers.users.user);

  // ==============================================
  /**
   * SEARCH Routes
   */
  router.all('/search', checkAuth);
  router.all('/search/*', checkAuth);

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

module.exports.Router = _router;
