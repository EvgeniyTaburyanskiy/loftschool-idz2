var HttpError = require('../../middleware/HttpError').HttpError;

var getAlbumById = function (req, res, next, param_value) {
  var album = {};
  req.album = album;
  return next();
};

var getUserById = function (req, res, next, UserId) {

  if (UserId) {
    try {
      var uid = new ObjectID(UserId);
    }
    catch (e) {
      return next(new HttpError(400, 'ILLEGAL_PARAM_VALUE'));
    }

    User.findById(uid).lean().exec(function (err, user) {
      if (err) return next(err);
      req.user = user;
      console.log(req.user);
    });
  }

  return next();
};

var getPhotosBySearchWords = function (req, res, next, param_value) {
  var photos = [];
  req.search.photos = photos;
  return next();
};

exports = module.exports = {
  album_id:     getAlbumById,
  user_id:      getUserById,
  search_words: getPhotosBySearchWords
}