var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schemaLike = require('./Like').schema;
/**
 * Схема Фотки
 */
var schemaPhoto = new Schema({
  _album_id:  Schema.Types.ObjectId,
  name:       {
    type:      String,
    default:   "Фото без названия!",
    minlength: 1,
    maxlength: 100,
    trim:      true,
    required:  true
  },
  descr:      {
    type:      String,
    minlength: 3,
    maxlength: 1000,
    trim:      true,
    required:  false
  },
  imgURL:     { //-> URL
    type:      String,
    maxlength: 2000, // https://www.boutell.com/newfaq/misc/urllength.html
    trim:      true,
    required:  true
  },
  thumbURL:   {//-> URL
    type:      String,
    maxlength: 2000,
    trim:      true,
    required:  false
  },
  album_bg:   {
    type:    Boolean,
    default: false
  },
  comments:   {
    type:     Schema.Types.ObjectId,
    required: false
  },
  likes:      [schemaLike],
  created_at: {
    type:    Date,
    default: Date.now
  }
});

var modelPhoto = mongoose.model('Photo', schemaPhoto);

modules.exports = modelPhoto;
