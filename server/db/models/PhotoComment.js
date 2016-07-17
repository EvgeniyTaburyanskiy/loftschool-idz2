/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

/**
 * Схема Коллекции Комментариев к Фоткам
 */
var schemaPhotoComments = require('../schemas/PhotoComment');

module.exports = {
  PhotoComments: mongoose.model('PhotoComments', schemaPhotoComments)
};
