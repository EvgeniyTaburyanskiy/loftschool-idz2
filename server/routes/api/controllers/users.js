var logger = require('../../../utils/winston')(module);
var User = require('../../../db/models/User').mUser;
var HttpError = require('../../../middleware/HttpError').HttpError;
var ObjectID = require('mongodb').ObjectID;

/* GET users page. */
var API_getUsersList = function (req, res, next) {
  // TODO: API- Список пользователей отдватаь по токену !
  User
  .find({}, '_id, userdata')
  .lean()
  .exec(function (err, users) {
    if (err) return next(err);
    next(new HttpError(200, null, '', users));
  });
};


/* GET user by ID. */
var API_getUserById = function (req, res, next) {
  var user_id = req.query.user_id || req.params.user_id || req.body.user_id || req.user._id;

  if (user_id === undefined) {
    return next(new HttpError(400, null, 'Неверно указан идентификатор пользователя!'));
  }

  try {
    var uid = new ObjectID(user_id);
  }
  catch (e) {
    return next(new HttpError(400, null, 'Неверно указан идентификатор пользователя!'));
  }

  User
  .findById(uid, '_id, userdata')
  .lean()
  .exec(function (err, user) {
    if (err) return next(err);
    next(new HttpError(200, null, '', [user]));
  });
};

/**
 *
 * @param req
 * @param res
 * @param next
 */
var API_addUser = function (req, res, next) {
  //TODO: API- Сделать регисрацию пользователя по API
  var result = {};
  next(new HttpError(200, null, '', result));
};

/**
 *
 * @param req
 * @param res
 * @param next
 */
var API_updateUser = function (req, res, next) {
  var user_id = req.query.user_id || req.params.user_id || req.body.user_id || req.user._id;


  if (user_id === undefined) {
    return next(new HttpError(400, null, 'Неверно указан идентификатор пользователя!'));
  }

  try {
    var uid = new ObjectID(user_id);
  }
  catch (e) {
    return next(new HttpError(400, null, 'Неверно указан идентификатор пользователя!'));
  }


  //TODO: API- Сделать обновление пользователя по API
  var result = {};
  next(new HttpError(200, null, '', result));
};

var API_updateUserSocials = function (req, res, next) {
  var user_id = req.query.user_id || req.params.user_id || req.body.user_id || req.user._id;
  
  var emailAddress = req.query.emailAddress || req.params.emailAddress || req.body.emailAddress;
  var g = req.query.g || req.params.g || req.body.g;
  var tw = req.query.tw || req.params.tw || req.body.tw;
  var fb = req.query.fb || req.params.fb || req.body.fb;
  var vk = req.query.vk || req.params.vk || req.body.vk;

  if (user_id === undefined) {
    return next(new HttpError(400, null, 'Неверно указан идентификатор пользователя!'));
  }

  try {
    var uid = new ObjectID(user_id);
  }
  catch (e) {
    return next(new HttpError(400, null, 'Неверно указан идентификатор пользователя!'));
  }
// Обновляем Социалку пользователя

  //TODO: API- Сделать обновление пользователя по API
  var result = {};
  next(new HttpError(200, null, '', result));
};

/**
 *
 * @param req
 * @param res
 * @param next
 */
var API_deleteUser = function (req, res, next) {
  //TODO: API- Сделать удаление пользователя по API
  var result = {};
  next(new HttpError(200, null, '', result));
};


exports = module.exports = {
  API_getUsersList:      API_getUsersList,
  API_getUserById:       API_getUserById,
  API_addUser:           API_addUser,
  API_updateUser:        API_updateUser,
  API_updateUserSocials: API_updateUserSocials,
  API_deleteUser:        API_deleteUser
};

