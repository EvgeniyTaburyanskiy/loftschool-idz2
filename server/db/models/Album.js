/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

/**
 * Схема Альбома
 */
var schemaAlbum = require('../schemas/Album');

module.exports = mongoose.model('Album', schemaAlbum);

