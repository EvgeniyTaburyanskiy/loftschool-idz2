/**
 * Мидлвар Подгружает данные пользователя на каждом Хите. в res.locals.user
 *
 * Чтобы он работал, ему нужна сессия. и Passport
 * т.е. Мидлвар должен быть после обработчика сессий. и после Passport
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports = function (req, res, next) {
  res.locals.user = undefined;

  if (req.session.passport === undefined ||
      req.session.passport.user === undefined) {
    return next();
  }

  res.locals.user = req.user;

  next();
};