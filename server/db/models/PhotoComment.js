/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

/**
 * Схема Коллекции Комментариев к Фоткам
 */
var schemaPhotoCommentList = require('../schemas/PhotoComment');

module.exports =  mongoose.model('PhotoCommentList', schemaPhotoCommentList);;
