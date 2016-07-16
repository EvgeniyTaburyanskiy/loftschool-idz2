/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Схема Фотки
 */
var schemaLike = new Schema({
  _user_id:  Schema.Types.ObjectId
});

var modelLike = mongoose.model('Like', schemaLike);

modules.exports = modelLike;