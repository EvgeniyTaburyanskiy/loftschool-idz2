/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

/**
 * Схема Фотки
 */
var schemaPhoto = require('../schemas/Photo');

module.exports = {
  mPhoto: mongoose.model('Photo', schemaPhoto)
};
