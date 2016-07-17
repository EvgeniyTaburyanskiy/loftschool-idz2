/**
 * Module dependencies.
 */
var logger = require('../utils/winston')(module);
var HttpError = require('../utils/HttpError').HttpError;

/* GET home page. */
var home = function (req, res, next) {

  res.render('index', {title: 'home'});
};

module.exports.home = home;
