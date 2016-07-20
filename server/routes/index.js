/**
 * PUBLIC ROUTER
 * Промежуточный обработчик уровня маршрутизатора
 * Обрабатывает маршруты Публичные
 */

/**
 * Module dependencies.
 */
var logger = require('../utils/winston')(module);
var checkAuth = require('../middleware/checkAuth');
var loadUser = require('../middleware/loadUser');
var config = require('../utils/nconf');
var router = require('express').Router();
var csrf = require('csurf');
var route_params = require('./api/routeparams.js');
var csrfProtection = csrf(config.get('csrf')); //-> add req.csrfToken() function

/**
 * ROUTING CONTROLLERS
 */
var controllers = {
  main:         require('./main'),         //-> Обработчик Маршрута Гланая стр
  auth:         require('./auth'),         //-> Обработчик Маршрута Авторизация/Регистрация/Восстановление пароля
  album:        require('./albums'),       //-> Обработчик Маршрута Альбом
  users:        require('./users'),        //-> Обработчик Маршрута Пользователь
  search:       require('./search'),       //-> Обработчик Маршрута Поиска
  error:        require('./error'),        //-> Обработчик Ошибочных запросов
  route_params: require('./api/routeparams') //-> Обработчик Параметров
};


/**
 * Router
 * @param app
 * @returns {*}
 * @private
 */
var _router = function (app) {

 // router.param('user_id',route_params);          //->

  // HOME ROUTES ==============================================
  router.route('/')
  .all(checkAuth, loadUser)
  .get(controllers.main.getHome); //-> Выдаем Гл страницу

  // AUTH ROUTES ==============================
  router.get('/auth', csrfProtection, controllers.auth.signin);//-> Отдаем страницу Авторизации/Регистрации/Восстановления пароля
  router.all('/auth/signout', controllers.auth.signout);       //-> Любой метод =  Выход из Системы

  // RESET PASSWORD ROUTES ==============================
  router.route('/reset')
  .get(controllers.auth.getfogot)     //-> Редирект на страницу Авторизации/Восстановления пароля
  
  router.route('/reset/:token')
  .get(csrfProtection, controllers.auth.getreset)     //-> Проверяем токен(из письма) и выдаем страницу смены пароля

  // ALBUM ROUTES ==============================================
  router.route(['/albums', '/albums/*'])
  .all(checkAuth, loadUser, csrfProtection);
  /*
   Поумолчанию Отдаем страницу альбомов текущего пользователя(собственные альбомы) редирект на страницу Пользователь
   С параметром отдаем страницу с фотками конкретного альбома 
   */
  router.get('/albums', controllers.album.get);
  router.get('/albums/:album_id', controllers.album.getById);      //-> Отдаем страницу альбом-детальная по его ID

  // USERS ROUTES ==============================================
  router.route(['/users', '/users/*'])
  .get(checkAuth, loadUser, csrfProtection);

  /*
   Поумолчанию Отдаем страницу  Текущего  пользователя (список альбомов пользователя, ЛичКабинет)
   Если задан в запросе req.query набор уточнений. то Ищем в нем UID и отдаем как /users/:user_id
   (список альбомов пользователя + шапка с данными пользователя)
   */
  router.get('/users', controllers.users.get);
  
  /*
   Отдаем Персональную страницу  пользователя по ID
   (список альбомов пользователя + шапка с данными пользователя)
   */
  router.get('/users/:user_id', controllers.users.get);

  // SEARCH ROUTES ==============================================
  router.route(['/search', '/search/*'])
  .all(checkAuth, loadUser);

  /*
   Поумолчанию Отдаем пустую страницу поиска
   Если задан в запросе req.query набор уточнений. то Ищем в нем "q" и отдаем с результатом поиска.
   Так же как /search/:search_words
   */
  router
  .get('/search', controllers.search.search)
  .post('/search', controllers.search.search)
  .get('/search/:search_words', controllers.search.search)
  .post('/search/:search_words', controllers.search.search);


  // DEFAULT  Route 404 ==============================================
  router.use(controllers.error.err_404);

  // ERROR HANDLERS ==============================================
  router.use(controllers.error.err_all);

  return router;
};

module.exports.Router = _router;
