/**
 * API
 * Промежуточный обработчик уровня маршрутизатора
 * Обрабатывает маршруты API
 */

/**
 * Module dependencies.
 */
var logger = require('../../utils/winston')(module);
var checkAuth = require('../../middleware/checkAuth');
var loadUser = require('../../middleware/loadUser');
var HttpError = require('../../middleware/HttpError').HttpError;
var config = require('../../utils/nconf');
var router = require('express').Router();
var csrf = require('csurf');
var csrfProtection = csrf(config.get('csrf'));//-> add req.csrfToken() function
/**
 * Router
 * @param app
 * @returns {*}
 * @private
 */
var _router = function (app) {

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

  /*
   * TODO: - api_key Валидацию через мдлвар в app.param (http://expressjs.com/ru/api.html#app.param)
   * */
  //router.all('*', chkApiKey);

  // HOME ROUTES ==============================================
  router.get('/api', controllers.main.api_home); //-> Редиректим на авторизацию публички



  // AUTH ROUTES ==============================
  router.route('/api/auth/signin')
  .post(csrfProtection, controllers.auth.api_signin);//-> Вход в Систему

  router.route('/api/auth/signout')
  .all(controllers.auth.api_signout);//-> Выход из Системы

  router.route('/api/auth/signup')
  .post(csrfProtection, controllers.auth.api_signup);//-> Регистрация

  router.route('/api/auth/fogot')
  .post(csrfProtection, controllers.auth.api_postfogot); //-> Восстановление пароля(отправка письма с токеном)
  
  router.route('/api/auth/reset')
  .all(csrfProtection, controllers.auth.api_passwdreset); //-> Смена пароля(применение нового пароля)

  // ALBUM ROUTES ==============================================
  router.route(['/api/albums', '/api/albums/*'])
  .all(checkAuth, loadUser)
  .get(controllers.albums.api_getalbum)
  .post(controllers.albums.api_addalbum);


  // USERS ROUTES ==============================================
  router.route(['/api/users', '/api/users/*'])
  .all(checkAuth, loadUser);

  router.route('/api/users')
  .get(controllers.users.list);       //->

  router.route('/api/users/:user_id')
  .get(controllers.users.get)         //->
  .post(controllers.users.add)        //->
  .put(controllers.users.update)      //->
  .delete(controllers.users.delete);  //->



  // SEARCH ROUTES ==============================================
  router.route(['/api/search', '/api/search/*'])
  .all(checkAuth, loadUser)
  .get(controllers.search.search);



  // DEFAULT  Route 404 ==============================================
  router.use('/api', controllers.error.err_404);



  // ERROR HANDLERS ==============================================
  router.use('/api', controllers.error.err_all);

  return router;
};

module.exports.Router = _router;
