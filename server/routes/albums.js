var logger = require('../utils/winston')(module);
var HttpError = require('../utils/HttpError').HttpError;

/* GET albums page. */
var albums = function (req, res, next) {
  res.render('index', {title: 'albums'});
};


/* GET album by ID. */
var album = function (req, res, next) {
  res.render('index', {title: 'album'});
};


module.exports.albums = albums;
module.exports.album = album;
