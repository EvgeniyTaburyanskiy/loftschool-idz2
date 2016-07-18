/**
 * Промежуточный обработчик уровня маршрутизатора
 * Обрабатывает маршруты
 */

/**
 * Module dependencies.
 */
var logger = require('../utils/winston')(module);
var checkAuth = require('../middleware/checkAuth');
var loadUser = require('../middleware/loadUser');

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
    next();
  });

  // HOME ROUTES ==============================================
  router.all('/', checkAuth);
  router.get('/', loadUser, controllers.main.home);

  // AUTH ROUTES ==============================

  router.get('/auth', controllers.auth.get); //-> Отдаем страницу Авторизации/Регистрации/Восстановления пароля

  router.post('/auth/signin',  controllers.auth.post.signin); //-> Вход в Систему

  router.all('/auth/signout', controllers.auth.post.signout);//-> GET/POST  Выход из Системы 

  router.post('/auth/signup', controllers.auth.post.signup); //-> Регистрация

  router.post('/auth/fogot', controllers.auth.post.fogot); //-> Восстановление пароля

  // ALBUM ROUTES ==============================================
  router.all('/albums', checkAuth);
  router.all('/albums/*', checkAuth);

  router.get('/albums', controllers.albums.albums);

  // USERS ROUTES ==============================================
  router.all('/users', checkAuth);
  router.all('/users/*', checkAuth);

  router.get('/users', controllers.users.users);
  router.get('/users/:id', controllers.users.user);

  // SEARCH ROUTES ==============================================

  router.all('/search', checkAuth);
  router.all('/search/*', checkAuth);

  router.get('/search', controllers.search.search);

  // DEFAULT  Route 404 ==============================================
  router.use(controllers.error.err_404);

  // ERROR HANDLERS ==============================================
  router.use(controllers.error.err_all);

  return router;
};

module.exports.Router = _router;
