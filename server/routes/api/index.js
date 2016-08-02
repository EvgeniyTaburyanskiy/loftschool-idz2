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
var multer = require('multer');
var Upload = multer(config.get('multer'));

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
    main:   require('./controllers/main'),         //-> Обработчик Маршрута Гланая стр
    auth:   require('./controllers/auth'),         //-> Обработчик Маршрута Авторизация/Регистрация/Восстановление пароля
    albums: require('./controllers/albums'),       //-> Обработчик Маршрута Альбом
    photos: require('./controllers/photos'),       //-> Обработчик Маршрута Фотографий
    users:  require('./controllers/users'),        //-> Обработчик Маршрута Пользователь
    error:  require('./controllers/error')         //-> Обработчик Ошибочных запросов
  };

  /*
   * TODO: - api_key Валидацию через мидлвар в app.param (http://expressjs.com/ru/api.html#app.param)
   * */
  //router.all('*', chkApiKey);
  router.use(function (req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    logger.info('API Remote req IP = %s', ip);
    next();
  });          //->

  // HOME ROUTES ==============================================
  router.get(['/api', '/api/method/'], controllers.main.api_home); //-> Редиректим на авторизацию публички


  // AUTH ROUTES ==============================
  router.route('/api/method/auth.signin')
  .post(
      //csrfProtection,
      controllers.auth.api_signin);     //-> Вход в Систему

  router.route('/api/method/auth.signout')
  .all(controllers.auth.api_signout);    //-> Выход из Системы

  router.route('/api/method/auth.signup')
  .post(
      //csrfProtection,
      controllers.auth.api_signup);     //-> Регистрация

  router.route('/api/method/auth.fogotPasswd')
  .post(
      //csrfProtection,
      controllers.auth.api_fogotPasswd);//-> Восстановление пароля(отправка письма с токеном)

  router.route('/api/method/auth.resetPasswd')
  .post(
      //csrfProtection,
      controllers.auth.api_resetPasswd); //-> Смена пароля(применение нового пароля)


  // USERS ROUTES ==============================================
  /*
   *  TODO: API-ROUTE - U Изменить список социалок пользователя
   *  TODO: API-ROUTE - U Изменить карточку пользоватея(ФИ+Описание+Фотка+Фон)
   *
   * */
  router.route(['/api/method/users*'])
  .all(checkAuth);

  router.route('/api/method/users.getUsersList')
  .get(controllers.users.API_getUsersList);       //->

  router.route('/api/method/users.getUserById')
  .get(controllers.users.API_getUserById);        //->

  router.route('/api/method/users.addUser')
  .post(
      //csrfProtection,
      controllers.users.API_addUser);           //->

  router.route('/api/method/users.updateUserProfile')
  .post(
      // csrfProtection,
      controllers.users.API_updateUserProfile);                 //->

  router.route('/api/method/users.updateUserImgs')
  .post(
      //csrfProtection,
      Upload.fields([
        {name: 'ava_img'},
        {name: 'bg_img'}
      ]),
      controllers.users.API_updateUserImgs);                      //->


  router.route('/api/method/users.deleteUser')
  .post(
      //csrfProtection,
      controllers.users.API_deleteUser);       //->


  // ALBUM ROUTES ==============================================
  router.route(['/api/method/albums.getAlbumByID'])// R Список Фоток Альбома (Id альбома)
  .get(controllers.albums.API_getAlbumById);

  router.route(['/api/method/albums.getAlbumsByUser'])// R Выдать список альбомов пользователя (ID пользователя)
  .get(controllers.albums.API_getAlbumsByUser);

  router.route(['/api/method/albums.addAlbum'])   // C Добавление нового альбома(имя, описние, фотка-фон)
  .post(
      // csrfProtection,
      Upload.single('album_bg'),
      controllers.albums.API_addAlbum
  );

  router.route(['/api/method/albums.updateAlbum'])    // U Изменение Альбома (ID альбома, Имя, Описание, Фон)
  .post(
      //csrfProtection,
      Upload.single('album_bg'), // Ожидаем форму с полем тип единичный файл.Имя поля - "album_bg"
      controllers.albums.API_updateAlbum
  );

  router.route(['/api/method/albums.deleteAlbum'])    // D Удаление Альбома и всех его фоткок
  .post(
      //csrfProtection,
      controllers.albums.API_deleteAlbum);


  // PHOTO ROUTES ==============================================
  /*
   *  TODO: API-ROUTE - С Добавление Фото (Id альбома,фалы фоток)
   *
   *  TODO: API-ROUTE - R Список новых фоток (Кол-во, Номер с которого)
   *  (https://stackoverflow.com/questions/12542620/how-to-make-pagination-with-mongoose)
   *  (https://stackoverflow.com/questions/5539955/how-to-paginate-with-mongoose-in-node-js)
   *  TODO: API-ROUTE - R Поиск Фоток по ключевому слову описанию и/или имени (ключевое слово)
   *  TODO: API-ROUTE - R Детальная Инфо о фотографии (Id фото)
   *
   *  TODO: API-ROUTE - U Изменение Фото по ID ( Id фото,Имя,Описание)
   *  TODO: API-ROUTE - U Добавить Like фотке (Id фото)
   *  TODO: API-ROUTE - U Добавление коментария  (Id фото, Текст Коментария)
   *  TODO: API-ROUTE - U Перенос Фотки в другой альбом (Список ID фото, Id нового альбома)
   *
   *  TODO: API-ROUTE - D Удаление Фото (ID Фото,Флаг подтверждения)
   * */

  router.route(['/api/method/photos.getNewPhotos'])// R Список новых фоток (Кол-во, Стартовый номер)
  .all(controllers.photos.API_getNewPhotos);

  router.route(['/api/method/photos.getPhotoById'])//  R Детальная Инфо о фотографии (Id фото)
  .post(controllers.photos.API_getPhotoById);

  router.route(['/api/method/photos.addPhoto']) // С Добавление Фото (Id альбома,файлы фоток)
  .post(
      Upload.any(),
      controllers.photos.API_addPhoto);

  router.route(['/api/method/photos.addPhotoComment'])// U Добавление коментария  (Id фото, Текст Коментария)
  .post(controllers.photos.API_addPhotoComment);

  router.route(['/api/method/photos.addPhotoLike'])// U Добавить Like фотке (Id фото)
  .post(controllers.photos.API_addPhotoLike);

  router.route(['/api/method/photos.deletePhoto'])// D Удаление Фото (ID Фото,Флаг подтверждения)
  .post(controllers.photos.API_deletePhoto);

  router.route(['/api/method/photos.updatePhoto'])// U Изменение Фото по ID ( Id фото,Имя,Описание)
  .post(controllers.photos.API_updatePhoto);

  router.route(['/api/method/photos.searchPhotos'])// R Поиск Фоток по ключевому слову описанию и/или имени (ключевое слово)
  .post(controllers.photos.API_searchPhotos);

  router.route(['/api/method/photos.movePhotos'])// U Перемещение фоток в Др Альбом ( Id альбома,массив Id фоток)
  .post(controllers.photos.API_movePhotos);


  // DEFAULT  Route 404 ==============================================
  router.use('/api', controllers.error.err_404);


  // ERROR HANDLERS ==============================================
  router.use('/api', controllers.error.err_all);

  return router;
};

module.exports.Router = _router;
