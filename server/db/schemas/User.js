/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var logger = require('../../utils/winston')(module);
var async = require('async');
var crypto = require('crypto');
var util = require('util');
var Schema = mongoose.Schema;
var schemaUserData = require('./UserData').sUserData;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

/**
 * Схема Коллекции Пользователей
 */
var schemaUser = new Schema({
  username:               {
    type:      String,
    maxlength: 254,
    lowercase: true,
    trim:      true,
    unique:    true,
    required:  true
  },
  hashedPassword:         {
    type:     String,
    required: true
  },
  salt:                   {
    type:     String,
    required: true
  },
  resetPasswordToken:     {
    type: String
  },
  resetPasswordExpires:   {
    type: Date
  },
  emailConfirmationToken: {
    type:    String,
    default: new mongoose.Types.ObjectId().toString()
  },
  emailConfirmed:         {
    type:    Boolean,
    default: false
  },
  userdata:               {
    type:    schemaUserData,
    default: schemaUserData
  }, // Данные пользователя будем хранить в этой же коллекции. Схема данных описана в UserData
  created:                {
    type:    Date,
    default: Date.now
  }
});

schemaUser.plugin(deepPopulate);
// ================= User Entity Methods =============================
schemaUser.methods.encryptPassword = function (password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  //more secure -return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
};

schemaUser.methods.checkPassword = function (password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

// ================= Schema Statics Methods =============================
schemaUser.statics.authorize = function (username, password, next) {
  var User = this;
  async.waterfall([
        function (done) {
          User.findOne({'username': username.toLowerCase()}, done);//-> Ищем пользователя в БД по username(он же email)
        },
        function (user, done) {// ошибок не возникло возвращен результат из пред функции
          if (!user) {//-> пользователь не найден в БД
            logger.debug('Такого пользователя не существует %s', username);
            return done(new AuthError('Такого пользователя не существует'), false);
          }

          if (!user.checkPassword(password)) { //-> Проверяем пароль
            logger.debug('Введен неверный пароль для пользователя %s', username);
            return done(new AuthError('Вы ввели неверный пароль'), false);
          }
          // Пользователь существует и пароль верен, возврат пользователя из
          // метода done, что будет означать успешную аутентификацию
          done(null, user);
        }
      ],
      next //-> Все ОК отдаем Passport(у) результат
  );
};

schemaUser.statics.register = function (username, password, next) {
  var User = this;
  async.waterfall([
        function (done) {
          User
          .findOne({'username': username.toLowerCase()}, done);//-> Ищем пользователя в БД по username(он же email)
        },
        function (user, done) {// ошибок не возникло возвращен результат из пред функции
          if (user) {//-> если пользователь найден
            return done(new AuthError('Имя пользователя уже занято'), false); //-> возвращаем собственную ошибку
          }
          else {//-> пользователь по email не найден в БД
            var newUser = new User({
              'username': username,
              'password': password
            });

            // Дополняем данными объект пользователя
            newUser.userdata.email = username;

            // Сохраняем нового пользователя в БД.
            // И передаем управление следующему обработчику
            newUser.save(function (err) {
              //http://mongoosejs.com/docs/validation.html
              // err is our ValidationError object
              // err.errors.emailAddress is a ValidatorError object
              // err.errors.password is a ValidatorError object
              if (err) return done(err, false);
              done(null, newUser);
            });
          }
        }
      ],
      next
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

// ================= Validation =============================
schemaUser.path('hashedPassword').validate(function (value) {
  if (this._plainPassword) {
    if (this._plainPassword.length < 8) {
      this.invalidate('password', 'Пароль должен содержать не менее 8 символов ');
    }
  }
  if (this.isNew && !this._plainPassword) {
    this.invalidate('password', 'Пароль не может быть пустым');
  }
}, null);

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
exports = module.exports = {
  sUser:     schemaUser,
  AuthError: AuthError
};






