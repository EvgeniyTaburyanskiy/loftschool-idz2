var async = require('async');
var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;

var User = require('../../db/models/User').mUser;


var getUserById = function (user_id, callback) {

  if (!user_id || typeof callback !== 'function') {
    throw new Error('Не верные параметры');
  }

  if (user_id) {
    try {
      var uid = new ObjectID(user_id);
    }
    catch (e) {
      return callback(new Error('Не верно указан ID пользователя'));
    }
  }
  else {
    return callback(new Error('Не верно указан ID пользователя'));
  }

  // Получаем Инфо об Альбоме
  async.waterfall([
        function (done) {
          User
          .find({'_id': uid})
          .lean()
          .exec('find', done);
        }
      ],
      callback
  );
};


exports = module.exports = getUserById;