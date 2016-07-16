/**
 * Module dependencies.
 */
var logger = require('../utils/winston')(module);

/* GET home page. */
var home = function (req, res, next) {
  logger.debug('%s %d %s', req.method, res.statusCode, req.url);
  res.render('index', {title: 'home'});
};

module.exports = {
  home: home
};
