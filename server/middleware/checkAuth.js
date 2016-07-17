/**
 * Промежуточный обработчик уровня приложения
 * Проверяет статус авторизации пользователя
 */

var HttpError = require('../utils/HttpError').HttpError;

module.exports =  function (req, res, next) {
  if(!req.session.user){
    res.redirect('/auth');
    //return next(new HttpError(401,'Вы не авторизованы!'));
  }else{
    next();
  }
};