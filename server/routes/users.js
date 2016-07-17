var logger = require('../utils/winston')(module);
var User = require('../db/models/User');
var HttpError = require('../utils/error').HttpError;


/* GET users page. */
var getUsers = function (req, res, next) {
  User.find({}, function (err, users) {
    if (err) return next(err);
    res.json(users);
  });

  //res.render('index', {title: 'albums'});
};

/* GET user by ID. */
var getUserById = function (req, res, next) {
  res.render('index', {title: 'getUserById'});
};


module.exports = {
  users: getUsers,
  user:  getUserById
};
