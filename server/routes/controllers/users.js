var async = require('async');
var logger = require('../../utils/winston')(module);
var Core = require('../../utils/core');
var HttpError = require('../../middleware/HttpError').HttpError;


var User = require('../../db/models/User').mUser;

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
var getUserPage = function (req, res, next) {
  var user_id = req.query.user_id || req.params.user_id || req.user._id || null;

  //logger.debug('User Id=', user_id);

  if (!user_id) {
    return next(new HttpError(400, 'ILLEGAL_PARAM_VALUE', 'Не верно указан ID пользователя'));
  }

  async.parallel({
        owner:  function (done) {
          Core.getUserById(user_id, function (err, owner) {
            if (err) return done(err);
            return done(null, owner);
          })
        },
        albums: function (done) {
          Core.getAlbumsByUser(req.user._id, function (err, albums) {
            if (err) return done(err);
            return done(null, albums);
          })
        }
      },
      function (err, results) {
        if (err) return next(err);

        res.render('user',
            {
              title:     'USER Page',
              csrfToken: req.csrfToken(),
              owner:     (results.owner.length) ? results.owner[0] : {},
              albums:    results.albums || []
            }
        );
      });


};


/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
var getUserPageByID = function (req, res, next) {
  return getUserPage(req, res, next);
};


exports = module.exports = {
  getUserPage:     getUserPage,
  getUserPageByID: getUserPageByID
};

