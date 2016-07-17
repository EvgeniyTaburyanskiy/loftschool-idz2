/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

/**
 * Схема Коллекции Пользователей
 */
var schemaUser = require('../schemas/User').sUser;


module.exports = {
  mUser: mongoose.model('User', schemaUser)
};