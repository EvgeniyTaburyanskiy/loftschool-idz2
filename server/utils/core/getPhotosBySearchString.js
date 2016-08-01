var async = require('async');
var mongoose = require('mongoose');
var logger = require('../../utils/winston')(module);
var Photo = require('../../db/models/Photo').mPhoto;

/**
 * Для работы полнотекстового поиска его сначала надо включить.
 * https://habrahabr.ru/post/174457/
 * https://docs.mongodb.com/manual/reference/method/db.collection.createIndex/#db.collection.createIndex
 *
 * db.photos.createIndex( { name : "text", descr: "text" }, { default_language: "russian" })
 *
 */

/**
 *
 * @param search
 * @param count
 * @param skip
 * @param callback
 * @returns {Error}
 */
var getPhotosBySearchString = function (search, count, skip, callback) {
  var serch_str = '';

  if (typeof skip === 'function') {
    callback = skip;
    skip = undefined;
  }
  if (typeof count === 'function') {
    callback = count;
    count = undefined;
  }

  if (typeof callback !== 'function') return new Error('Не верные пароаметры');

  if (!search.length) return callback(null, []);

  skip = parseInt(skip) || 0;
  count = parseInt(count) || 6;

  search = search.split(';').map(function (item) {
    return '\"' + item.trim() + '\"';
  });

  logger.debug('search array', search);

  async.waterfall([
        function (done) {
          Photo
          .find({$text: {$search: search.join(' ')}})
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


exports = module.exports = getPhotosBySearchString;