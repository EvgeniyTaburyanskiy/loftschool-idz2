'use strict';
var fs = require('fs');
var gmagic = require('gm');
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
function PhotoResizer(options) {
}

PhotoResizer.prototype = {
  _resizeAvatar: function () {
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

  _resizePhoto: function () {
    var
        that         = this,
        options_big  = config.get('photoresizer:set:photos_big'),
        photos_small = config.get('photoresizer:set:photos_small');

    async.parallel({
          // Ресайз основной фотки
          imgPath:   function (done) {
            gmagic(that.originalImagePath)
            .resize(options_big.size.width, options_big.size.height, '')
            .noProfile()
            .quality(70)
            //.extent(options_big.size.width, options_big.size.height)
            .gravity('center')
            .write(that.resizedImgPath, function (err) {
              done(err, that.resizedImgPath);
            });
          },
          // Подготовка превью основной фотки
          thumbPath: function (done) {
            gmagic(that.originalImagePath)
            .resize(photos_small.size.width, photos_small.size.height, '')
            .noProfile()
            .quality(70)
            //.extent(photos_small.size.width, photos_small.size.height)
            .gravity('center')
            .write(that.resizedImgThumbPath, function (err) {
              done(err, that.resizedImgThumbPath);
            });
          }
        },
        function (err, results) {
          if (that.callback && typeof(that.callback) === 'function') {
            if (err) return that.callback(err);
            return that.callback(err, results);
          }
        });

  },

  resize: function (img, type, callback) {
    if (typeof type === 'function') {
      callback = type;
      type = undefined;
    }
    if (!type || ['photo', 'avatar'].indexOf(type.toLowerCase()) !== -1) {
      type = 'photo';
    }

    this.img = img;
    this.imgType = type;
    this.callback = callback;


    this.originalImagePath = path.join(__dirname, '/../', this.img.path);
    this.saveFolder = path.join(__dirname, '/../', this.img.saveto);

    var ext = this.img.originalname.split(".").pop();
    this.resizedImgThumbPath = this.saveFolder + '/photos/thumb-' + this.img.destfilename + '.' + ext;


    if (this.imgType === 'avatar') {
      this.resizedImgPath = this.saveFolder + '/ava/' + this.img.destfilename + '.' + ext;

      return this._resizeAvatar();
    }

    if (this.imgType === 'photo') {
      this.resizedImgPath = this.saveFolder + '/photos/' + this.img.destfilename + '.' + ext;
      return this._resizePhoto();
    }

  }

};

exports = module.exports = new PhotoResizer;