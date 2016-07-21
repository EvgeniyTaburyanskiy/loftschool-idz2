/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


/**
 * Схема Фотки
 */
var schemaPhoto = new Schema({
  _album_id:  {
    type: Schema.Types.ObjectId,
    ref:  'Album'
  },
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
    default:   '',
    maxlength: 250,
    trim:      true,
    required:  false
  },
  imgURL:     { //-> URL
    type:      String,
    default:   '/assets/img/no_photo.jpg',
    maxlength: 2000, // https://www.boutell.com/newfaq/misc/urllength.html
    trim:      true,
    required:  true
  },
  thumbURL:   {//-> URL
    type:      String,
    default:   '/assets/img/no_photo.jpg',
    maxlength: 2000,
    trim:      true,
    required:  false
  },
  album_bg:   {
    type:    Boolean,
    default: false
  },
  comments:   { //-> Комменты Храним в отдельной коллекции. В данной только ссылку на документ коменнтов к данной фотке.
    type:     Schema.Types.ObjectId,
    ref:      'PhotoComment', //-> Указывает на имя Модели.
    required: false
  },
  likes:      [{
    _user_id: { //-> 
      type:     Schema.Types.ObjectId,
      ref:      'User',
      required: false
    }
  }], //-> Лайки храним как вложенный объект
  created_at: {
    type:    Date,
    default: Date.now
  }
});

// ================= Event Func =============================

schemaPhoto.pre('remove', function(next){
  // Перед Удалением Фотки, удаляем все Комменты к нему
  this.model('PhotoComment').remove(
      {_photo_id: this._id},
      {multi: true},
      next
  );
});

module.exports.sPhoto = schemaPhoto;
