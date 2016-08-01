var async = require('async');
var mongoose = require('mongoose');

var Photo = require('../../db/models/Photo').mPhoto;

/**
 *
 * @param count
 * @param skip
 * @param callback
 * @returns {Error}
 */
var getAlbumPhotos = function (album_id, count, skip, callback) {

  if (typeof count === 'function') {
    callback = count;
    count = undefined;
  }

  if (typeof skip === 'function') {
    callback = skip;
    skip = undefined;
  }

  if (!album_id || typeof callback !== 'function') {
    throw new Error('Не верные параметры');
  }

  skip = parseInt(skip) || 0;
  count = parseInt(count) || 12;

  async.waterfall([
        function (done) {
          Photo
          .find({'_album_id': album_id})
          .sort({created_at: 'desc'})
          .skip(skip)
          .limit(count)
          .deepPopulate('_album_id comments')
          .exec('find', done);
        }
      ],
      callback
  );
};


exports = module.exports = getAlbumPhotos;