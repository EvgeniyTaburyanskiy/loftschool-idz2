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
  var photo_id = req.query.photo_id || req.body.photo_id ;
  if (!photo_id) return(next(new HttpError(400,null,'Не верно указан ID фотографии')));

  Core.getPhotoById(photo_id, function (err, photo) {
    if (err) return next(err);
    return next(new HttpError(200, null, '', [photo]));
  })
  
};


var API_addPhoto = function (req, res, next) {
  var album_id = req.query.album_id || req.params.album_id ||  req.body.album_id;

  
};


var API_addPhotoComment = function (req, res, next) {
};


var API_addPhotoLike = function (req, res, next) {
};


var API_deletePhoto = function (req, res, next) {
};


var API_updatePhoto = function (req, res, next) {
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