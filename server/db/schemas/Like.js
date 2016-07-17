/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Схема Лайка
 */
var schemaLike = new Schema({
  _user_id:  Schema.Types.ObjectId
});

//var modelLike = mongoose.model('Like', schemaLike);

module.exports = schemaLike;