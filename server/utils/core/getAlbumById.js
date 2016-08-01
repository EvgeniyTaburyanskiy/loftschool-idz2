var async = require('async');
var Album = require('../../db/models/Album').mAlbum;

var getAlbumsById = function (album_id, callback) {
  if (!album_id || typeof callback !== 'function') {
    throw new Error('Не верные параметры');
  }

  // Получаем Инфо об Альбоме
  async.waterfall([
        function (done) {
          Album
          .find({_id: album_id}, 'id name descr _album_bg _user_id')
          .lean()
          .deepPopulate('_album_bg _user_id', 'img thumb userdata')
          .exec(function (err, albums) {
            if (err) return done(err);
            return done(err, albums);
          });
        }
      ],
      callback
  );
};

exports = module.exports = getAlbumsById;