/**
 * Module dependencies.
 */
var logger = require('../utils/winston')(module);
var ENV = process.env.NODE_ENV;

// catch 404 and forward to error handler
var err_404 = function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
};

var err_all = function (err, req, res, next) {
  res.status(err.status || 500);
  logger.error('%s %d %s', req.method, res.statusCode, err.message + ' ' + req.url);
  res.render('error', {
    message: err.message,
    error:   ENV === 'development' ? err : ''
  });
};


module.exports = {
  err_404: err_404,
  err_all: err_all
};
