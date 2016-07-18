/**
 * Промежуточный обработчик уровня приложения
 * Проверяет статус авторизации пользователя
 */
var ObjectID = require('mongodb').ObjectID;
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
  res.locals.user = null;
  if (!req.session.passport.user) return next();

  try {
    var uid = new ObjectID(req.session.passport.user);
  }
  catch (err) {
    return next(err);
  }

  User.findById(uid, 'userdata').lean().exec(function (err, user) {
    if (err) return next(err);

    res.locals.user = user.userdata;
    next();
  });
};