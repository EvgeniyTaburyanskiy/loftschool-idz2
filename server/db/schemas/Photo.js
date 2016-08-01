/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = mongoose.Schema;
var logger = require('../../utils/winston')(module);
var PhotoComments = require('../models/PhotoComment').mPhotoComments;


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
  img:        { //-> URL
    type:      String,
    default:   '/assets/img/no_photo.jpg',
    maxlength: 2000, // https://www.boutell.com/newfaq/misc/urllength.html
    trim:      true,
    required:  true
  },
  thumb:      {//-> URL
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

schemaPhoto.plugin(deepPopulate);
// ================= Event Func =============================

schemaPhoto.pre('remove', function (next) {
  // Перед Удалением Фотки, удаляем все Комменты к нему
  this.model('PhotoComment').remove(
      {_photo_id: this._id},
      {multi: true},
      next
  );
});

schemaPhoto.pre('save', function (next) {
  var that = this;
  if (that.isNew) {
    new PhotoComments({_photo_id: this._id}).save(function (err, list) {
      if (err) return next(err);
      that.comments = list._id;
    });
  }
  next();
});


module.exports.sPhoto = schemaPhoto;
