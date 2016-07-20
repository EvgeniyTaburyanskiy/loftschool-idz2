var logger = require('../utils/winston')(module);
var User = require('../db/models/User').mUser;
var HttpError = require('../middleware/HttpError').HttpError;
var ObjectID = require('mongodb').ObjectID;

/* GET users page. */
var getUsersList = function (req, res, next) {
  User.find({}, 'userdata').lean().exec(function (err, users) {
    if (err) return next(err);
    res.json(users);
  });

  //res.render('index', {title: 'albums'});
};

var getUserPage = function (req, res, next) {

  if (req.query.user_id) {
    try {
      var uid = new ObjectID(req.query.user_id);
    }
    catch (e) {
      return next(new HttpError(400, 'ILLEGAL_PARAM_VALUE'));
    }
    User.findById(uid, 'userdata').lean().exec(function (err, user) {
      if (err) return next(err);
      res.json(user.userdata);
    });
  }
  else{
    res.json(req.user.userdata);
  }

};

exports = module.exports = {
  list: getUsersList,
  get:  getUserPage
};

