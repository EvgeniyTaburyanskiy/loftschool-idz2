/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

/**
 * Схема Коллекции Комментариев к Фоткам
 */
var schemaPhotoComments = require('../schemas/PhotoComment').sPhotoComment;

module.exports.mPhotoComments = mongoose.model('PhotoComment', schemaPhotoComments);
