/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

/**
 * Схема Коллекции Комментариев к Фоткам
 */
var schemaPhotoCommentList = require('../schemas/PhotoComments');

module.exports =  mongoose.model('PhotoCommentList', schemaPhotoCommentList);;
