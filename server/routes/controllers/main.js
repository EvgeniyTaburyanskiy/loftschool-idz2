/**
 * Module dependencies.
 */
var logger = require('../../utils/winston')(module);
var async = require('async');
var Core = require('../../utils/core');


var getHome = function (req, res, next) {

  async.parallel({
        albums: function (done) {
          Core.getAlbumsByUser(req.user._id, function (err, albums) {
            if (err) return done(err);
            return done(null, albums);
          })
        },
        photos: function (done) {
          Core.getNewPhotos(9, function (err, photos) {
            if (err) return done(err);
            return done(null, photos);
          })
        }
      },
      function (err, results) {
        if (err) return next(err);
console.log(results);
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
