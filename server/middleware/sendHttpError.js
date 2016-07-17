/**
 * Module dependencies.
 */
var logger = require('../utils/winston')(module);
var ENV = process.env.NODE_ENV;

/**
 * Мидлвар Обрабатывает ошибки Http котрые мы генерим по коду приложения с помощью собственного объекта ошибки
 * HttpError.
 * На AJAX запросы отдает инфо об ошибке в виде JSON  иначе в виде рендера страницы Ошибки.
 * @param req
 * @param res
 * @param next
 */
module.exports = function (req, res, next) {
  res.sendHttpError = function (error) {
    res.status(error.status);

    if (res.req.headers['x-requested-with'] == 'XMLHttpRequest') { //-> Это AJAX запрос
      res.json(error);
    }
    else if (401 == res.statusCode) {
      res.redirect('/auth');
    }
    else {
      res.render('error', {
        message: error.message,
        error:   ENV === 'development' ? error : ''
      });
    }

    logger.debug('%s %d %s', req.method, res.statusCode, error.message + ' [' + req.url + ']');
  };

  next();
};