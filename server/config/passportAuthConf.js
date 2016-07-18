/**
 * Module dependencies.
 */
var logger = require('../utils/winston')(module);
var AuthLocalStrategy = require('passport-local').Strategy;
//var AuthFacebookStrategy = require('passport-facebook').Strategy;
//var AuthVKStrategy = require('passport-vkontakte').Strategy;

var AuthError = require('../db/schemas/User').AuthError;
var HttpError = require('../utils/HttpError').HttpError;
var ObjectID = require('mongodb').ObjectID;

var User = require('../db/models/User').mUser;

/**
 * Модуль конфигурирует Мидлвар Passport.js
 * @param passport
 */
module.exports = function (passport) {

// ================= Конфигурация Стратегий  =============================
  /**
   * Стратегия Локальной Авторизации.
   */
  passport.use('local-signin', new AuthLocalStrategy(
      function (username, password, done) {
        logger.debug('Passport auth = ', username, password);

        User.findOne({'username': username}, function (err, user) {//-> Ищем пользователя в БД по email(он же логин)
          if (err) {
            return done(err);
          }

          if (!user) {//-> пользователь по email не найден в БД
            logger.debug('Не верное имя пользователя %s', username);
            return done(null, false, {message: 'Не верное имя пользователя'});
          }

          if (!user.checkPassword(password)) { //-> Проверяем пароль
            logger.debug('Не верный Пароль %s для пользователя %s', password, username);
            return done(null, false, {message: 'Не верный Пароль'});
          }
          // Пользователь существует и пароль верен, возврат пользователя из
          // метода done, что будет означать успешную аутентификацию
          done(null, user); //-> Все ОК отдаем Passport(у) пользователя
        });
      }
  ));


  /*
   passport.use('facebook', new AuthFacebookStrategy({
   clientID: config.get("auth:fb:app_id"),
   clientSecret: config.get("auth:fb:secret"),
   callbackURL: config.get("app:url") + "/auth/fb/callback",
   profileFields: [
   'id',
   'displayName',
   'profileUrl',
   "username",
   "link",
   "gender",
   "photos"
   ]
   },
   function (accessToken, refreshToken, profile, done) {

   //console.log("facebook auth: ", profile);

   return done(null, {
   username: profile.displayName,
   photoUrl: profile.photos[0].value,
   profileUrl: profile.profileUrl
   });
   }
   ));

   passport.use('vk', new AuthVKStrategy({
   clientID: config.get("auth:vk:app_id"),
   clientSecret: config.get("auth:vk:secret"),
   callbackURL: config.get("app:url") + "/auth/vk/callback"
   },
   function (accessToken, refreshToken, profile, done) {

   //console.log("facebook auth: ", profile);

   return done(null, {
   username: profile.displayName,
   photoUrl: profile.photos[0].value,
   profileUrl: profile.profileUrl
   });
   }
   ));
   */
// ================= Функции для работы с Сессиями =============================
  /**
   * Для того, чтобы сохранять или доставать пользовательские данные из сессии, паспорт использует функции `passport.serializeUser()` и `passport.deserializeUser()`.
   */
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (user_id, done) {
    try {
      var uid = new ObjectID(user_id);
    }
    catch (err) {
      return done(err, null);
    }

    User.findById(uid).lean().exec(function (err, user) {
      done(err, user);
    });
  });
}
;