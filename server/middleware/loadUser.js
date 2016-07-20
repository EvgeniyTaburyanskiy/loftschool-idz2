/**
 * Промежуточный обработчик уровня приложения
 * Проверяет статус авторизации пользователя
 */
var ObjectID = require('mongodb').ObjectID;
var User = require('../db/models/User').mUser;

/**
 * Мидлвар Подгружает данные пользователя на каждом Хите. в res.locals.user
 *
 * Чтобы он работал, ему нужна сессия. и Passport
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

  res.locals.user = req.user;
  next();
};