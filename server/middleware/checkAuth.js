/**
 * Промежуточный обработчик уровня приложения
 * Проверяет статус авторизации пользователя
 */

var HttpError = require('../utils/error').HttpError;

module.exports =  function (req, res, next) {
  if(!req.session.user){
    return next(new HttpError(401,'Вы не авторизованы!'));
  }
  next();
};