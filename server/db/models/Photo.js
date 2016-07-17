/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

/**
 * Схема Фотки
 */
var schemaPhoto = require('../schemas/Photo').sPhoto;

module.exports.mPhoto = mongoose.model('Photo', schemaPhoto);
