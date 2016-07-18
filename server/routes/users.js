var logger = require('../utils/winston')(module);
var User = require('../db/models/User').mUser;
var HttpError = require('../middleware/HttpError').HttpError;
var ObjectID = require('mongodb').ObjectID;

/* GET users page. */
var getUsers = function (req, res, next) {
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


module.exports.users = getUsers;
module.exports.user = getUserById;
