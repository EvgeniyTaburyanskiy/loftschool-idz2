/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schemaUserData = require('./UserData');

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
// ================= User Methods =============================
schemaUser.methods.encryptPassword = function (password) {
  //less secure -return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
};

schemaUser.methods.checkPassword = function (password) {
  return this.encryptPassword(password) === this.hashedPassword;
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


//var modelUser = mongoose.model('User', schemaUser);

module.exports = schemaUser;

