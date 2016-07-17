/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schemaComment = require('./Comment').sComment;

/**
 * Схема Коллекции Комментариев к Фоткам
 */
var schemaPhotoCommentList = new Schema({
  commentlist: [schemaComment]
});

//var modelPhotoCommentList = mongoose.model('PhotoCommentList', schemaPhotoCommentList);

module.exports.sPhotoComments = schemaPhotoCommentList;
