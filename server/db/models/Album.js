/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

/**
 * Схема Альбома
 */
var schemaAlbum = require('../schemas/Album').sAlbum;

module.exports.mAlbum = mongoose.model('Album', schemaAlbum);

