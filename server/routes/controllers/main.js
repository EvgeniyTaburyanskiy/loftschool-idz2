/**
 * Module dependencies.
 */
var logger = require('../../utils/winston')(module);
var async = require('async');
var getAlbumsByUser = require('../../utils/helpers/getAlbumsByUser');
var getNewPhotos = require('../../utils/helpers/getNewPhotos');


var getHome = function (req, res, next) {
[].length
  async.parallel({
        albums: function (done) {
          getAlbumsByUser(req.user._id, function (err, albums) {
            if (err) return done(err);
            return done(null, albums);
          })
        },
        photos: function (done) {
          getNewPhotos(1, 9, function (err, photos) {
            if (err) return done(err);
            return done(null, photos);
          })
        }
      },
      function (err, results) {
        if (err) return next(err);

        res.render('main',
            {
              title:      'HOME',
              csrfToken:  req.csrfToken(),
              newPotos:   results.photos || [],
              userAlbums: results.albums || []
            }
        );
      });


};

exports = module.exports = {
  getHome: getHome
};
