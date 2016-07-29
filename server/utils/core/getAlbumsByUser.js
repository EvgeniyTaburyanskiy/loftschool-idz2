var async = require('async');
var Album = require('../../db/models/Album').mAlbum;

var getAlbumsByUser = function (user_id, callback) {
  if (!user_id || typeof callback !== 'function') {
    throw new Error('Не верные параметры');
  }

  // Получаем Инфо об Альбомах
  async.waterfall([
        function (done) {
          Album
          .find({_user_id: user_id}, 'id name descr _album_bg')
          .lean()
          .deepPopulate('_album_bg', 'img thumb')
          .exec(function (err, albums) {
            if (err) return done(err);
            return done(err, albums);
          });
        }
      ],
      callback
  );
};

exports = module.exports = getAlbumsByUser;