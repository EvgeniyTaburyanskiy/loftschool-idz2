/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Схема Единичного комментария
 */
var schemaComment = new Schema({
  _user_id:   Schema.Types.ObjectId,
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

module.exports = schemaComment;
