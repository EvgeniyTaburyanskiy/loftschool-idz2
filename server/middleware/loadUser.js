
/**
 * Промежуточный обработчик уровня приложения
 * Проверяет статус авторизации пользователя
 */

var User = require('../db/models/User').mUser;

/**
 * Мидлвар Подгружает данные пользователя на каждом Хите.
 * Если в сессии есть id пользователя. (т.е. он авторизован)
 *
 * Чтобы он работал, ему нужна сессия.
 * т.е. Мидлвар должен быть после обработчика сессий.
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports = function (req, res, next) {
  req.user = res.locals.user = null;
  if (!req.session.user) return next();

  User.findById(req.session.user, function (err, user) {
    if (err) return next(err);
    
    req.user = res.locals.user = user;
    next();
  });
};