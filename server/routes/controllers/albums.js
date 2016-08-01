var logger = require('../../utils/winston')(module);
var async = require('async');
var Core = require('../../utils/core');
var HttpError = require('../../middleware/HttpError').HttpError;


var get = function (req, res, next) {
  // TODO: Обрабатывать request там может быть задан ID альбома ?album_id=Num
  res.redirect('/users/');
};


var getById = function (req, res, next) {
  var album_id = req.query.album_id || req.params.album_id;

  async.parallel({
        album:  function (done) {
          Core.getAlbumById(album_id, function (err, album) {
            if (err) return done(err);
            return done(null, album);
          })
        },
        photos: function (done) {
          Core.getAlbumPhotos(album_id, function (err, photos) {
            if (err) return done(err);
            return done(null, photos);
          })
        }
      },
      function (err, results) {
        if (err) return next(err);

        res.render('album',
            {
              title:      'ALBUM',
              csrfToken:  req.csrfToken(),
              owner:      (results.album.length) ? results.album[0]._user_id : {},
              album:      (results.album.length) ? results.album[0] : {},
              albumPotos: results.photos || []
            }
        );
      });
};


exports = module.exports = {
  get:     get,
  getById: getById
};

