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
  .post(csrfProtection, controllers.auth.api_signin);     //-> Вход в Систему

  router.route('/api/auth/signout')
  .all(controllers.auth.api_signout);                     //-> Выход из Системы

  router.route('/api/auth/signup')
  .post(csrfProtection, controllers.auth.api_signup);     //-> Регистрация

  router.route('/api/auth/fogot')
  .post(csrfProtection, controllers.auth.api_postfogot);  //-> Восстановление пароля(отправка письма с токеном)

  router.route('/api/auth/reset')
  .all(csrfProtection, controllers.auth.api_passwdreset); //-> Смена пароля(применение нового пароля)

  // ALBUM ROUTES ==============================================
  /*
   *  TODO: API-ROUTE - C Добавление нового альбома(имя, описние, фотка-фон)
   *  TODO: API-ROUTE - R Выдать список альбомов пользователя (ID пользователя)
   *  TODO: API-ROUTE - U Изменение Альбома (ID альбома, Имя, Описание, Фон)
   *  TODO: API-ROUTE - D Удалить Альбом и все его фотки
   * */
  router.route(['/api/albums'])
  .get(controllers.albums.api_getalbum)
  .post(controllers.albums.api_addalbum);

  router.route(['/api/albums/useralbums'])
  .get(controllers.albums.api_getuseralbums);

  // USERS ROUTES ==============================================
  /*
   *  TODO: API-ROUTE - R Данные пользователя по ID
   *  TODO: API-ROUTE - U Изменить список социалок пользователя
   *  TODO: API-ROUTE - U Изменить карточку пользоватея(ФИ+Описание+Фотка+Фон)
   *
   * */
  router.route(['/api/users', '/api/users/*'])
  .all(checkAuth);

  router.route('/api/users')
  .get(controllers.users.list);       //->


  router.route('/api/users/:user_id')
  .get(controllers.users.get)         //->
  .post(controllers.users.add)        //->
  .put(controllers.users.update)      //->
  .delete(controllers.users.delete);  //->


  // PHOTO ROUTES ==============================================
  /*
   *  TODO: API-ROUTE - С Добавление Фото (Id альбома,фалы фоток)
   *  TODO: API-ROUTE - R Список Фоток Альбома (Id албьома)
   *  TODO: API-ROUTE - R Список новых фоток (Кол-во, Номер с которого)
   *  (https://stackoverflow.com/questions/12542620/how-to-make-pagination-with-mongoose)
   *  (https://stackoverflow.com/questions/5539955/how-to-paginate-with-mongoose-in-node-js)
   *  TODO: API-ROUTE - R Поиск Фоток по ключевому слову описанию и/или имени (ключевое слово)
   *  TODO: API-ROUTE - R Детальная Инфо о фотографии (Id фото)
   *  TODO: API-ROUTE - U Изменение Фото по ID ( Id фото,Имя,Описание)
   *  TODO: API-ROUTE - U Добавить Like фотке (Id фото)
   *  TODO: API-ROUTE - U Добавление коментария  (Id фото, Текст Коментария)
   *  TODO: API-ROUTE - U Перенос Фотки в другой альбом (Список ID фото, Id нового альбома)
   *  TODO: API-ROUTE - D Удаление Альбома (ID Альбома,Флаг подтверждения)
   * */


  // SEARCH ROUTES ==============================================
  router.route(['/api/search', '/api/search/*'])
  .all(checkAuth)
  .get(controllers.search.search);


  // DEFAULT  Route 404 ==============================================
  router.use('/api', controllers.error.err_404);


  // ERROR HANDLERS ==============================================
  router.use('/api', controllers.error.err_all);

  return router;
};

module.exports.Router = _router;
