var logger = require('../utils/winston')(module);
var User = require('../db/models/User').mUser;
var HttpError = require('../middleware/HttpError').HttpError;
var ObjectID = require('mongodb').ObjectID;
var async = require('async');

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
var getUserPage = function (req, res, next) {
  var user_;
  var uid = req.query.user_id || req.params.user_id || null;

  if (uid) {
    try {
      var oUid = new ObjectID(uid);
    }
    catch (e) {
      return next(new HttpError(400, 'ILLEGAL_PARAM_VALUE'));
    }

    User.findById(oUid).lean().exec(function (err, user) {
      if (err) return next(err);
      res.render('person', {
        title: 'person',
        $user: user
      });
    });
  }
  else {
    res.render('person', {
      title: 'person',
      $user: req.user
    });
  }

};

exports = module.exports = {
  get: getUserPage
};

