var logger = require('../../utils/winston')(module);
var HttpError = require('../../middleware/HttpError').HttpError;
var async = require('async');
var multer = require('multer');
var upload = multer({dest: '/public/uploads/files/_tmp'});

var Album = require('../../db/models/Album').mAlbum;
var Photo = require('../../db/models/Photo').mPhoto;
var PhotoComment = require('../../db/models/PhotoComment').mPhotoComments;

/**
 *
 * @param req
 * @param res
 * @param next
 */
var API_getAlbumByID = function (req, res, next) {
  var album_id = req.query.album_id || req.params.album_id || req.body.album_id;
  console.log(album_id);
  // Получаем Инфо об Альбоме
  // Получаем список Фоток Альбома
  // Получаем данные Владельца Альбома
  async.parallel([
    function (done) {
      Album
      .findById(album_id)
      .lean()
      .populate('_user_id')
      .populate('_album_bg')
      .exec(function (err, album) {
        if (err) return done(err);

        var result = {
          id:        album.id,
          name:      album.name,
          descr:     album.descr,
          _album_bg: {
            imgURL:   album._album_bg.imgURL,
            thumbURL: album._album_bg.thumbURL
          }

        };
        return done(err, result);
      });
    },
    function (done) {
      Photo
      .find({_album_id: album_id}, 'name descr imgURL thumbURL album_bg comments likes')
      .lean()
      .populate('comments')
      .exec(function (err, photos) {
        if (err) return done(err);
        var result = {};
        return done(err, photos);
      });
    }
  ], function (err, result) {
    if (err) return next(err);

    next(new HttpError(200, null, '',
        {
          album:  result[0],
          photos: result[1]

        })
    );
  });
};


/**
 *
 * @param req
 * @param res
 * @param next
 * @constructor
 */
var API_getUserAlbums = function (req, res, next) {
  var user_id = req.query.user_id || req.params.user_id || req.user._id;

  // Получаем Инфо об Альбомах
  async.waterfall([
    function (done) {
      Album
      .find({_user_id: user_id}, 'id name descr _album_bg')
      .lean()
      .populate('_album_bg', 'imgURL thumbURL')
      .exec(function (err, albums) {
        if (err) return done(err);
        return done(err, albums);
      });
    }
  ], function (err, albums) {
    if (err) return next(err);

    next(new HttpError(200, null, '', albums));
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
    // Устанавливаем обратную ссылку альбому на Фотку(фон)
    function (album, photo, done) {

      album._album_bg = photo._id;

      album.save(function (err) {
        if (err) return done(err);
        // TODO: API- Обработка ошибок валидации Сохранения Альбома
        return done(null, album, photo);
      });
    },
    // Получаем фотки и обрабатываем их. Сохраняем в FS и обновляем документ Фотки.
    function (album, photo, done) {
      var result;
      // TODO: API- Обработка Загруженой фотки с валидацией

      result = {
        id:        album.id,
        name:      album.name,
        descr:     album.descr,
        _album_bg: {
          imgURL:   photo.imgURL,
          thumbURL: photo.thumbURL
        }
      };
      return done(null, result);
    }
  ], function (err, result) {
    if (err) return next(err);

    // TODO: API- Код ошибки об успешном сосздании альбома
    next(new HttpError(200, null, '', result));
  });
};


exports = module.exports = {
  api_getalbum:      API_getAlbumByID,
  api_getuseralbums: API_getUserAlbums,
  api_addalbum:      API_addAlbum
};