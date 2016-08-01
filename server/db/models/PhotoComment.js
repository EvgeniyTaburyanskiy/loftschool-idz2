/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

/**
 * Схема Коллекции Комментариев к Фоткам
 */
var schemaPhotoComments = require('../schemas/PhotoComment').sPhotoComments;

module.exports.mPhotoComments = mongoose.model('PhotoComment', schemaPhotoComments);
