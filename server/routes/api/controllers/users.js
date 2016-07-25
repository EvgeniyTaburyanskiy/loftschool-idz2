var logger = require('../../../utils/winston')(module);
var User = require('../../../db/models/User').mUser;
var HttpError = require('../../../middleware/HttpError').HttpError;
var ObjectID = require('mongodb').ObjectID;

/* GET users page. */
var API_getUsersList = function (req, res, next) {
  User.find({}, 'userdata').lean().exec(function (err, users) {
    if (err) return next(err);

    res.json(users);
  });

  //res.render('index', {title: 'albums'});
};


/* GET user by ID. */
var API_getUserById = function (req, res, next) {
  try {
    var uid = new ObjectID(req.params.id);
  }
  catch (e) {
    return next(404);
  }

  User.findById(uid, 'userdata').lean().exec(function (err, user) {
    if (err) return next(err);

    res.json(user.userdata);
  });
};

/**
 *
 * @param req
 * @param res
 * @param next
 */
var API_addUser = function (req, res, next) {
  res.redirect('/auth');
};

/**
 *
 * @param req
 * @param res
 * @param next
 */
var API_updateUser = function (req, res, next) {

};

/**
 *
 * @param req
 * @param res
 * @param next
 */
var API_deleteUser = function (req, res, next) {

};


exports = module.exports = {
  API_getUsersList: API_getUsersList,
  API_getUserById:  API_getUserById,
  API_addUser:      API_addUser,
  API_updateUser:   API_updateUser,
  API_deleteUser:   API_deleteUser
};

