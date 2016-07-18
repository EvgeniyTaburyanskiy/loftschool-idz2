/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

/**
 * Схема Фотки
 */
var schemaPhoto = require('../schemas/Photo');

module.exports = mongoose.model('Photo', schemaPhoto);
