/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schemaComment = require('./Comment').sComment;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
/**
 * Схема Коллекции Комментариев к Фоткам
 */
var schemaPhotoCommentList = new Schema({
  _photo_id:    { //-> обратная ссылка на фотографию
    type: Schema.Types.ObjectId,
    ref:  'Photo'
  },
  comment_list: [{type: schemaComment}] //-> Комменты к фоткам храним как вложенные объекты
});

schemaPhotoCommentList.plugin(deepPopulate);
//var modelPhotoCommentList = mongoose.model('PhotoCommentList', schemaPhotoCommentList);

module.exports.sPhotoComments = schemaPhotoCommentList;
