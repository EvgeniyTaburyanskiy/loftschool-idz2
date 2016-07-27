var async = require('async');
var path = require('path');
var logger = require('../../../utils/winston')(module);
var HttpError = require('../../../middleware/HttpError').HttpError;
var config = require('../../../utils/nconf');
var PhotoResizer = require('../../../utils/PhotoResizer');


var Album = require('../../../db/models/Album').mAlbum;
var Photo = require('../../../db/models/Photo').mPhoto;
var PhotoComment = require('../../../db/models/PhotoComment').mPhotoComments;


var API_getNewPhotos = function (req, res, next) {
};


var API_getPhotoById = function (req, res, next) {
};


var API_addPhoto = function (req, res, next) {
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