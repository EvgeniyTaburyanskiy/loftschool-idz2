var logger = require('../../utils/winston')(module);
var HttpError = require('../../middleware/HttpError').HttpError;
var async = require('async');
var multer = require('multer');
var upload = multer({dest: '/public/uploads/files/_tmp'});

var Album = require('../../db/models/Album').mAlbum;
var Photo = require('../../db/models/Photo').mPhoto;

/**
 *
 * @param req
 * @param res
 * @param next
 */
var API_getAlbumByID = function (req, res, next) {
  var album_id = req.query.album_id || req.params.album_id || req.body.album_id;

  // Получаем Инфо об Альбоме
  // Получаем список Фоток Альбома
  // Получаем данные Владельца Альбома
  async.waterfall([
    function (done) {
      Album
      .findById(album_id)
      .populate('_user_id')
      .exec(function (err, album) {
        return done(err, album);
      });
    }
  ], function (err, result) {
    if (err) return next(err);
    //Все Ок. Токен сгенерен, письмо отправлено.
    // TODO: API- Сформировать объект ответа JSON по Восстановлению пароля
    next(new HttpError(200, null, '', result));
  });
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @constructor
 */
var API_addAlbum = function (req, res, next) {
  var album_name = req.body.album_name;
  var album_descr = req.body.album_descr;
  var album_photos = req.files;
  var user = req.user;


  async.waterfall([
    // Создаем Новый Альбом и сохраняем + связка с пльзователем
    function (done) {
      var newAlbum = new Album({
        _user_id: user._id,
        name:     album_name,
        descr:    album_descr
      });

      newAlbum.save(function (err) {
        if (err) return done(err);
        // TODO: API- Обработка ошибок валидации Сохранения Альбома
        return done(null, newAlbum);
      });
    },
    //Создаем документ в БД для хранения инфо о фотографии
    function (album, done) {
      var newPhoto = new Photo({
        _album_id: album._id,
        album_bg:  true
      });

      newPhoto.save(function (err) {
        if (err) return done(err);
        // TODO: API- Обработка ошибок валидации Сохранения Фотографии
        return done(null, album, newPhoto);
      });
    },
    // Получаем фотки и обрабатываем их. Сохраняем в FS и обновляем документ Фотки.
    function (album, photo, done) {
      // TODO: API- Обработка Загруженой фотки с валидацией
      return done(null, 'Success');
    }
  ], function (err, result) {
    if (err) return next(err);

    // TODO: API- Код ошибки об успешном сосздании альбома
    next(new HttpError(200, null, '', result));
  });
};


exports = module.exports = {
  api_getalbum: API_getAlbumByID,
  api_addalbum: API_addAlbum
};