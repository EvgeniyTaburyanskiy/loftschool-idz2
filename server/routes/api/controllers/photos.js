var async = require('async');
var path = require('path');
var logger = require('../../../utils/winston')(module);
var HttpError = require('../../../middleware/HttpError').HttpError;
var config = require('../../../utils/nconf');
var PhotoResizer = require('../../../utils/PhotoResizer');
var Core = require('../../../utils/core');

var Album = require('../../../db/models/Album').mAlbum;
var Photo = require('../../../db/models/Photo').mPhoto;
var PhotoComment = require('../../../db/models/PhotoComment').mPhotoComments;


var API_getNewPhotos = function (req, res, next) {
  var count = req.query.count || req.body.count || undefined;
  var skip = req.query.skip || req.body.skip || undefined;

  Core.getNewPhotos(count, skip, function (err, photos) {
    if (err) return next(err);
    return next(new HttpError(200, null, '', photos));
  })
};


var API_getPhotoById = function (req, res, next) {
  var photo_id = req.query.photo_id || req.body.photo_id;

  if (!photo_id) return (next(new HttpError(400, null, 'Не верно указан ID фотографии')));

  Core.getPhotoById(photo_id, function (err, photo) {
    if (err) return next(err);
    return next(new HttpError(200, null, '', photo));
  })

};


var API_addPhoto = function (req, res, next) {
  var album_id = req.query.album_id || req.params.album_id || req.body.album_id;


};


var API_addPhotoComment = function (req, res, next) {
};


var API_addPhotoLike = function (req, res, next) {
};


var API_deletePhoto = function (req, res, next) {
};


var API_updatePhoto = function (req, res, next) {
  var photo_id = req.query.photo_id || req.params.photo_id || req.body.photo_id;
  var photo_name = req.query.photo_name || req.params.photo_name || req.body.photo_name;
  var photo_descr = req.query.photo_descr || req.params.photo_descr || req.body.photo_descr || ' ';

  // TODO: API- Валидация данных перед обновлением  инфо фото

  if (!photo_id) {
    next(new HttpError(400, null, 'ID фото указано не верно!'));
  }

  async.waterfall([
        //Находим фото в БД
        function (done) {
          Photo
          .findOne({'_id': photo_id})
          .deepPopulate('_album_id _album_id._user_id')
          .exec(function (err, photo) {
            if (!photo) return done(new HttpError(400, null, 'Фото не существует!'));
            return done(err, photo);
          });
        },
        //Проверяем что фото принадлежит текущему пользователю
        function (photo, done) {
          if (!photo._album_id._user_id._id === req.user._id) {
            return done(new HttpError(400, null, 'Вы не являетесь владельцем фотографии!'));
          }
          return done(null, photo);
        },
        //Вносим изменения в Фото
        function (photo, done) {

          if (photo_name) photo.name = photo_name;
          if (photo_descr) photo.descr = photo_descr;

          photo.save(function (err) {
            if (err) {
              return done(new HttpError(500, null, 'В процессе сохранения данных о фото произошла ошибка!', err.message));
            }
            done(null, photo);
          });
        }
      ],
      function (err, result) {
        if (err) return next(err);
        next(new HttpError(200, null, 'Фото успешно изменено!', result));
      }
  )

};


var API_searchPhotos = function (req, res, next) {
};


var API_movePhotos = function (req, res, next) {
};


exports = module.exports = {
  API_getNewPhotos:    API_getNewPhotos,
  API_getPhotoById:    API_getPhotoById,
  API_addPhoto:        API_addPhoto,
  API_addPhotoComment: API_addPhotoComment,
  API_addPhotoLike:    API_addPhotoLike,
  API_deletePhoto:     API_deletePhoto,
  API_updatePhoto:     API_updatePhoto,
  API_searchPhotos:    API_searchPhotos,
  API_movePhotos:      API_movePhotos
};