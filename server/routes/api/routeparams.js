var HttpError = require('../../middleware/HttpError').HttpError;
var ObjectID = require('mongodb').ObjectID;
var User = require('../../db/models/User').mUser;


/**
 *
 * @param req
 * @param res
 * @param next
 * @param param_value
 * @returns {*}
 */
var getAlbumById = function (req, res, next, param_value) {
  var album = {};
  req.album = album;
  return next();
};


/**
 * Мидлвар обрабатывает запрос параметра user_id.
 * При удачном раскладе помещает результат в req.$user
 * @param req
 * @param res
 * @param next
 * @param UserId
 * @returns {*}
 */
var getUserById = function (req, res, next, UserId) {

  if (UserId) {
    try {
      var uid = new ObjectID(UserId);
    }
    catch (err) {
      return next(err);
    }

    User.findById(uid).lean().exec(function (err, user) {
      if (err) return next(err);
      req.$user = user;
      console.log('Params-uid', req.$user);
    });
  }

  return next();
};


/**
 *
 * @param req
 * @param res
 * @param next
 * @param param_value
 * @returns {*}
 */
var getPhotosBySearchWords = function (req, res, next, param_value) {
  var photos = [];
  req.search.photos = photos;
  return next();
};


exports = module.exports = function (req, res, next, param_value, param_name) {
  var controllers = {
    album_id:     getAlbumById,
    user_id:      getUserById,
    search_words: getPhotosBySearchWords
  };
  console.log('Param clb');
  controllers[param_name](req, res, next, param_value);

};