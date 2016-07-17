/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var async = require('async');
var crypto = require('crypto');
var util = require('util');
var Schema = mongoose.Schema;
var schemaUserData = require('./UserData').sUserData;

/**
 * Схема Коллекции Пользователей
 */
var schemaUser = new Schema({
  username:             {
    type:      String,
    maxlength: 254,
    default:   '',
    trim:      true,
    required:  false
  },
  hashedPassword:       {
    type:     String,
    required: true
  },
  salt:                 {
    type:     String,
    required: true
  },
  resetPasswordToken:   {
    type:      String,
    maxlength: 1024,
    default:   ''
  },
  resetPasswordExpires: {
    type:    Date,
    default: Date.now() + 3600000 // 1 hour
  },
  userdata:             schemaUserData, // Данные пользователя будем хранить в этой же коллекции. Схема данных описана в UserData
  created:              {
    type:    Date,
    default: Date.now
  }
});
// ================= User Entyty Methods =============================
schemaUser.methods.encryptPassword = function (password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  //more secure -return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
};

schemaUser.methods.checkPassword = function (password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

// ================= Schema Statics Methods =============================
schemaUser.statics.register = function (username, password, callback) {
  var User = this;
  async.waterfall([
        function (callback) {
          User.findOne({username: username}, callback);//-> Ищем пользователя в БД по username(он же email)
        },
        function (user, callback) {// ошибок не возникло возвращен результат из пред функции
          if (user) {//-> если пользователь найден
            callback(new AuthError('Пользователь с таким email уже существует')); //-> возвращаем собственную ошибку
          }
          else {//-> пользователь по email не найден в БД
            var newUser = new User({username: username, password: password});
            // Заполняем данными Поля пользователя.
            newUser.userdata.email = username;
            // Сохраняем нового пользователя в БД
            newUser.save(function (err) {
              if (err) return callback(err);
              callback(null, newUser);
            });
          }
        }
      ],
      callback
  );
};

// ================= User Virtuals =============================
schemaUser.virtual('userId')
.get(function () {
  return this.id;
});

schemaUser.virtual('password')
.set(function (password) {
  this._plainPassword = password;
  this.salt = crypto.randomBytes(32).toString('base64');
  //more secure - this.salt = crypto.randomBytes(128).toString('base64');
  this.hashedPassword = this.encryptPassword(password);
})
.get(function () {
  return this._plainPassword;
});

// ================= Private Func =============================
function AuthError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, AuthError);

  this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';
// ================= Exports =============================
//var modelUser = mongoose.model('User', schemaUser);

module.exports = {
  sUser:     schemaUser,
  AuthError: AuthError
};

module.exports.sUser = schemaUser;
module.exports.AuthError = AuthError;






