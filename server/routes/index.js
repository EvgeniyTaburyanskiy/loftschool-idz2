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
var route_params = require('./api/controllers/routeparams.js');
var csrfProtection = csrf(config.get('csrf')); //-> add req.csrfToken() function

/**
 * ROUTING CONTROLLERS
 */
var controllers = {
  main:         require('./controllers/main'),         //-> Обработчик Маршрута Гланая стр
  auth:         require('./controllers/auth'),         //-> Обработчик Маршрута Авторизация/Регистрация/Восстановление пароля
  album:        require('./controllers/albums'),       //-> Обработчик Маршрута Альбом
  users:        require('./controllers/users'),        //-> Обработчик Маршрута Пользователь
  search:       require('./controllers/search'),       //-> Обработчик Маршрута Поиска
  error:        require('./controllers/error'),        //-> Обработчик Ошибочных запросов
  route_params: require('./api/controllers/routeparams') //-> Обработчик Параметров
};


/**
 * Router
 * @param app
 * @returns {*}
 * @private
 */
var _router = function (app) {

  router.use(function (req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    logger.info('PUBLIC Remote req IP = %s', ip);
    next();
  });          //->

  // HOME ROUTES ==============================================
  router.route('/')
  .all(checkAuth)
  .get(csrfProtection, controllers.main.getHome); //-> Выдаем Гл страницу

  // AUTH ROUTES ==============================
  router.get('/auth', csrfProtection, controllers.auth.signin);//-> Отдаем страницу Авторизации/Регистрации/Восстановления пароля
  router.all('/auth/signout', controllers.auth.signout);       //-> Любой метод =  Выход из Системы

  router.route('/reset')
  .get(controllers.auth.getFogot);                    //-> Редирект на страницу Авторизации/Восстановления пароля

  router.route('/reset/:token')
  .get(csrfProtection, controllers.auth.getReset);     //-> Проверяем токен(из письма) и выдаем страницу смены пароля

  router.route('/email.confirm/:token')
  .get(controllers.auth.confirmEmail);                 //-> Проверяем токен(из письма) и подтверждаем E-mail

  // ALBUM ROUTES ==============================================
  router.route(['/albums', '/albums/*'])
  .all(checkAuth, csrfProtection);
  /*
   Поумолчанию Отдаем страницу альбомов текущего пользователя(собственные альбомы) редирект на страницу Пользователь
   С параметром отдаем страницу с фотками конкретного альбома 
   */
  router.get('/albums', controllers.album.get);
  router.get('/albums/:album_id', controllers.album.getById);      //-> Отдаем страницу альбом-детальная по его ID

  // USERS ROUTES ==============================================
  router.route(['/users', '/users/*'])
  .get(checkAuth, csrfProtection);

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
  .all(checkAuth);

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
