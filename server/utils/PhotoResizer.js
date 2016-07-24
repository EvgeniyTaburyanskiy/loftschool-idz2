'use strict';
var fs = require('fs');
var gmagic = require('gm');
var imagic = gmagic.subClass({imageMagick: true});
var async = require('async');
var path = require('path');
var config = require('./nconf');
var logger = require('./winston')(module);
/**
 *
 * @param img
 * @param type
 * @param callback
 * @constructor
 */
function PhotoResizer(img, type, callback) {
  if (typeof type === 'function') {
    callback = type;
    type = undefined;
  }

  if (!type || ['photo', 'avatar'].indexOf(type.toLowerCase()) !== -1) {
    type = 'photo';
  }

  this.imgType = type;
  this.img = img;
  this.callback = callback;
  this.init();
}

PhotoResizer.prototype = {
  resizeAvatar: function () {
    var
        that    = this,
        options = config.get('photoresizer:set:avatar');

    gmagic(that.originalImagePath)
    .resize(options.size.width, options.size.height)
    .gravity('center')
    .quality(70)
    .noProfile()
    .extent(options.size.width, options.size.height)
    .write(that.resizedImgPath, function (err) {
      if (that.callback && typeof(that.callback) === 'function') {
        var resizedImgs = {
          "imgPath":   that.resizedImgPath,
          "thumbPath": ''
        };
        that.callback(err, resizedImgs);
      }
    });
  },

  resizePhoto: function () {
    var
        that         = this,
        options_big  = config.get('photoresizer:set:photos_big'),
        photos_small = config.get('photoresizer:set:photos_small');

    async.series({
          // Ресайз основной фотки
          imgPath:   function (done) {
            gmagic(that.originalImagePath)
            .resize(options_big.size.width, options_big.size.heigh)
            .gravity('center')
            .noProfile()
            .quality(70)
            .extent(options_big.size.width, options_big.size.height)
            .write(that.resizedImgPath, function (err) {
              done(err, that.resizedImgPath);
            });
          },
          // Подготовка превью основной фотки
          thumbPath: function (done) {
            gmagic(that.originalImagePath)
            .resize(photos_small.size.width, photos_small.size.height)
            .gravity('center')
            .noProfile()
            .quality(70)
            .extent(photos_small.size.width, photos_small.size.height)
            .write(that.resizedImgThumbPath, function (err) {
              done(err, that.resizedImgThumbPath);
            });
          }
        },
        function (err, results) {
          logger.debug('Resize Photo Result -', err, results);
          if (that.callback && typeof(that.callback) === 'function') {
            if (err) return that.callback(err);
            return that.callback(err, results);
          }
        });

  },

  init: function () {
    var saveFolder = path.join(__dirname, '/../', config.get('photoresizer:savefolder'));
    this.originalImagePath = path.join(__dirname,'/../', this.img.path);

    if (this.imgType === 'avatar') {
      this.resizedImgPath = '/ava/' + this.img.originalname;

      this.resizeAvatar();
    }

    if (this.imgType === 'photo') {
      this.resizedImgThumbPath = saveFolder + '/photos/thumb-' + this.img.originalname;
      this.resizedImgPath = saveFolder + '/photos/' + this.img.originalname;

      this.resizePhoto();
    }

  }
};

exports = module.exports = PhotoResizer;