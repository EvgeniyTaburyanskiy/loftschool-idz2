/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var async = require('async');
var util = require('util');
var Schema = mongoose.Schema;
var schemaUserData = require('./UserData').sUserData;

/**
 * Схема Коллекции Пользователей
 */
var schemaUser = new Schema({
  email:          {
    type:     String,
    unique:   true,
    required: true
  },
  hashedPassword: {
    type:     String,
    required: true
  },
  salt:           {
    type:     String,
    required: true
  },
  userdata:       schemaUserData,
  created:        {
    type:    Date,
    default: Date.now
  }
});
// ================= User Entyty Methods =============================
schemaUser.methods.encryptPassword = function (password) {
  //less secure -return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
};

schemaUser.methods.checkPassword = function (password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

// ================= Schema Statics Methods =============================
schemaUser.statics.authorise = function (login, password, callback) {
  var User = this;
};

schemaUser.statics.register = function (login, password, callback) {
  var User = this;
  async.waterfall([
        function (callback) {
          User.findOne({email: login}, callback);//-> Ищем пользователя в БД по email(он же логин)
        },
        function (user, callback) {// ошибок не возникло возвращен результат из пред функции
          if (user) {//-> если пользователь найден проверяем его пароль
            callback(new AuthError('Пользователь с таким email уже существует')); //-> возвращаем собственную ошибку
          }
          else {//-> пользователь по email не найден в БД
            var newUser = new User({email: login, password: password});
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






