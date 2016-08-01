var logger = require('../../utils/winston')(module);
var HttpError = require('../../middleware/HttpError').HttpError;
var async = require('async');
var Core = require('../../utils/core');

/**
 *
 * @param req
 * @param res
 * @param next
 */
var getSearch = function (req, res, next) {
  var str = req.query.q || req.params.q || '';

  search_str = str.split(';').map(function (item) {
    return '\"' + item.trim() + '\"';
  });

  async.parallel({
        albums: function (done) {
          return done(null, []);
        },
        photos: function (done) {
          Core.getPhotosBySearchString(str, function (err, photos) {
            if (err) return done(err);
            return done(null, photos);
          })
        }
      },
      function (err, results) {
        if (err) return next(err);

        res.render('search',
            {
              title:      'SEARCH',
              photos:     results.photos || [],
              albums:     results.albums || [],
              orig_str:   str || '',
              search_str: search_str || []
            }
        );
      });

};

exports = module.exports = {
  search: getSearch
};
