/**
 * Вспомогательная схема для других коллекций
 * Не создаем отдельную модель для нее. А просто используем как вложенный тип данных с заданной схемой.
 *
 * http://mongoosejs.com/docs/subdocs.html
 */


/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Схема Единичного комментария
 */
var schemaComment = new Schema({
  _user_id:   {
    type: Schema.Types.ObjectId,
    ref:  'User'
  },
  message:    {
    type:      String,
    minlength: 3,
    maxlength: 1000,
    trim:      true,
    required:  true
  },
  created_at: {
    type:    Date,
    default: Date.now
  }
});


//var modelComment = mongoose.model('Comment', schemaComment);

module.exports.sComment = schemaComment;
