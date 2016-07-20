/**
 * Промежуточный обработчик уровня приложения
 * Проверяет статус авторизации пользователя
 */

var HttpError = require('../middleware/HttpError').HttpError;


module.exports = function (req, res, next) {
  // https://github.com/jaredhanson/passport/blob/a892b9dc54dce34b7170ad5d73d8ccfba87f4fcf/lib/passport/http/request.js#L74
  if (req.isAuthenticated()) {//-> Метод добавляется модулем passport. не документированный метод.
    return next();
  }
  
  // Неавторизованных отправляем на авторизацию!
  res
  .status(401)
  .redirect('/auth');
};
