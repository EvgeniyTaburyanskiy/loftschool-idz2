/**
 * Module dependencies.
 */
var logger = require('../utils/winston')(module);
var AuthLocalStrategy = require('passport-local').Strategy;
//var AuthFacebookStrategy = require('passport-facebook').Strategy;
//var AuthVKStrategy = require('passport-vkontakte').Strategy;

var AuthError = require('../db/schemas/User').AuthError;
var HttpError = require('../middleware/HttpError').HttpError;
var ObjectID = require('mongodb').ObjectID;

var User = require('../db/models/User').mUser;

/**
 * Модуль конфигурирует Мидлвар Passport.js
 * @param passport
 */
module.exports = function (passport) {

// ================= Конфигурация Стратегий  =============================
  /*
   * Стратегия Локальной Авторизации.
   * Авторизацию форвардим в Схему
   */
  passport.use('local-signin', new AuthLocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password'
      },
      function (username, password, done) {
        return User.authorize(username, password, done);
      }
  ));

  /*
   * Стратегия Локальной Регистрации
   */
  passport.use('local-signup', new AuthLocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password'
      },
      function (username, password, done) {
        return User.register(username, password, done);
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
  /*
   * Для того, чтобы сохранять или доставать пользовательские данные из сессии, passport использует функции
   * `passport.serializeUser()` и `passport.deserializeUser()`.
   */

  /**
   * сохраняем только ID
   */
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  /**
   * Достаем из Сессии ID и получаем свежие данные о Пользователе без оберточных служебных функций Mongoose
   */
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
  }); //-> Достаем в req.user
}
;