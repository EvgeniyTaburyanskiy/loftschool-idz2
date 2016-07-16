var logger = require('../utils/winston')(module);

// catch 404 and forward to error handler
var err_404 = function (req, res, next) {
  var err = new Error('Not Found');
  logger.debug('%s %d %s', req.method, res.statusCode, req.url);
  err.status = 404;
  next(err);
};

var err_all = function (err, req, res, next) {
  res.status(err.status || 500);
  logger.error('%s %d %s', req.method, res.statusCode, err.message);
  res.render('error', {
    message: err.message,
    error:   err
  });
};

var err_allDev = function (err, req, res, next) {
  res.status(err.status || 500);
  logger.error('%s %d %s', req.method, res.statusCode, err.message);
  res.render('error', {
    message: err.message,
    error:   err
  });
};

module.exports = {
  err_404:    err_404,
  err_all:    err_all,
  err_allDev: err_allDev
};
