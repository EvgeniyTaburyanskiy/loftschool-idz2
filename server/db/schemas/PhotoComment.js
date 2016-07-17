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
  _photo_id:   { //-> обратная ссылка на фотографию
    type: Schema.Types.ObjectId,
    ref:  'Photo'
  },
  comment_list: [schemaComment] //-> Комменты к фоткам храним как вложенные объекты
});

//var modelPhotoCommentList = mongoose.model('PhotoCommentList', schemaPhotoCommentList);

module.exports.sPhotoComments = schemaPhotoCommentList;
