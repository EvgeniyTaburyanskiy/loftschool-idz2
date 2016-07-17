/**
 * Module dependencies.
 */
var logger = require('../utils/winston')(module);
var ENV = process.env.NODE_ENV;
var HttpError = require('../utils/HttpError').HttpError;
var express = require('express');


// catch 404 and forward to error handler
var err_404 = function (req, res, next) {
  var err = new HttpError(404);
  next(err);
};

var err_all = function (err, req, res, next) {

  if (typeof  err === 'number') {
    err = new HttpError(err);
  }
  
  if (err instanceof HttpError) {
    res.sendHttpError(err);
  }
  else {
    if (ENV === 'development') {
      logger.debug('%s %d %s', req.method, res.statusCode, err.message);
      express.errorHandler()(err, req, res, next);
    } else {
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
};


module.exports.err_404 = err_404;
module.exports.err_all = err_all;

