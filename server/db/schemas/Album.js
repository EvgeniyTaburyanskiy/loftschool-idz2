/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Схема Альбома
 */
var schemaAlbum = new Schema({
  _user_id:   {
    type: Schema.Types.ObjectId,
    ref:  'User'
  },
  _album_bg:  {
    type: Schema.Types.ObjectId,
    ref:  'Photo'
  },
  name:       {
    type:      String,
    default:   "Альбом без названия!",
    minlength: 1,
    maxlength: 100,
    trim:      true,
    required:  true
  },
  descr:      {
    type:      String,
    default:   "",
    maxlength: 254,
    trim:      true,
    required:  false
  },
  created_at: {
    type:    Date,
    default: Date.now
  }
});


// ================= Event Func =============================
schemaAlbum.pre('remove', function (next) {
  // Перед Удалением Альбома удаляем все Фотки с ним связанные.
  this.model('Photo').remove(
      {
        _album_id: this._id,
        multi:     true
      },
      next
  );
});

//var modelAlbum = mongoose.model('Album', schemaAlbum);

module.exports.sAlbum = schemaAlbum;

