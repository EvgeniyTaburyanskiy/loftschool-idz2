var async = require('async');
var mongoose = require('mongoose');

var Photo = require('../../db/models/Photo').mPhoto;


var getPhotoById = function (photo_id, callback) {
  if (!photo_id || typeof callback !== 'function') {
    throw new Error('Не верные параметры');
  }
  // Получаем Инфо об Альбоме
  async.waterfall([
        function (done) {
          Photo
          .find({'_id': photo_id})
          .deepPopulate('_album_id _album_id._user_id comments')
          .exec('find', done);
        }
      ],
      callback
  );
};


exports = module.exports = getPhotoById;