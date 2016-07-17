/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Схема Коллекции Личных Данных Пользователей
 */
var schemaUserData = new Schema({
  email: {
    type:     String,
    unique:   true,
    required: true
  }
});


//var modelUserData = mongoose.model('UserData', schemaUserData);

module.exports = schemaUserData;

