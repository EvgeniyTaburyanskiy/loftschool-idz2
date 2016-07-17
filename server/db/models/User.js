/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

/**
 * Схема Коллекции Пользователей
 */
var schemaUser = require('../schemas/User');


module.exports = mongoose.model('User', schemaUser);

