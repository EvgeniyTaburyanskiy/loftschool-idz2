var async = require('async');
var Album = require('../../db/models/Album').mAlbum;
var Photo = require('../../db/models/Photo').mPhoto;

var getNewPhotos = function (num_start, count, callback) {
  if (typeof num_start === 'function') {
    callback = num_start;
    num_start = undefined;
  }
  if (typeof count === 'function') {
    callback = count;
    count = undefined;
  }

  if (typeof callback !== 'function') return new Error('Не верные пароаметры');

  num_start = parseInt(num_start) || 1;
  count = parseInt(count) || 6;

  // Получаем Инфо об Альбомах
  var query = Photo.find({});

  async.parallel({
        count:  function (done) {
          query.count(done);
        },
        photos: function (done) {
          query
          .sort({created_at: 'desc'})
          .skip(num_start)
          .limit(count)
          .populate('_album_id _album_id._user_id comments')
          .exec('find', done);
        }
      },
      callback
  );
};


exports = module.exports = getNewPhotos;