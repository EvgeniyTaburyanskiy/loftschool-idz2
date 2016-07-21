var logger = require('../../../utils/winston')(module);
var User = require('../../../db/models/User').mUser;
var HttpError = require('../../../middleware/HttpError').HttpError;
var ObjectID = require('mongodb').ObjectID;

/* GET users page. */
var getUsersList = function (req, res, next) {
  User.find({}, 'userdata').lean().exec(function (err, users) {
    if (err) return next(err);

    res.json(users);
  });

  //res.render('index', {title: 'albums'});
};

/* GET user by ID. */
var getUserById = function (req, res, next) {
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

var addUser = function (req, res, next) {
  res.redirect('/auth');
};

var updateUser = function (req, res, next) {

};

var delUser = function (req, res, next) {

};

exports = module.exports = {
  list:   getUsersList,
  get:    getUserById,
  add:    addUser,
  update: updateUser,
  delete: delUser
};

