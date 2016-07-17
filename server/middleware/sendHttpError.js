/**
 * Module dependencies.
 */
var logger = require('../utils/winston')(module);
var ENV = process.env.NODE_ENV;


module.exports = function (req, res, next) {

  res.sendHttpError = function (error) {

    res.status(error.status);
    if (res.req.headers['x-requested-with'] == 'XMLHttpRequest'){ //-> Это AJAX запрос
      res.json(error);
    }
    else{
      res.render('error', {
        message: error.message,
        error:   ENV === 'development' ? error : ''
      });      
    }
    logger.debug('%s %d %s', req.method, res.statusCode, error.message + ' [' + req.url +']');
  };

  next();
};