var async = require('async');
var mongoose = require('mongoose');

var Album = require('../../db/models/Album').mAlbum;
var Photo = require('../../db/models/Photo').mPhoto;

/**
 *
 * @param count
 * @param skip
 * @param callback
 * @returns {Error}
 */
var getNewPhotos = function (count, skip, callback) {
  if (typeof skip === 'function') {
    callback = skip;
    skip = undefined;
  }
  if (typeof count === 'function') {
    callback = count;
    count = undefined;
  }

  if (typeof callback !== 'function') return new Error('Не верные пароаметры');

  skip = parseInt(skip) || 0;
  count = parseInt(count) || 6;

  // Получаем Инфо об Альбомах
  var query = Photo.find({});

  async.waterfall([
        function (done) {
          query
          .sort({created_at: 'desc'})
          .skip(skip)
          .limit(count)
          .deepPopulate('_album_id _album_id._user_id comments')
          .exec('find', done);
        }
      ],
      callback
  );
};


exports = module.exports = getNewPhotos;