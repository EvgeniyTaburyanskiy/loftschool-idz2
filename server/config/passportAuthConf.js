/**
 * Модуль конфигурирует Мидлвар Passport.js
 * @param passport
 */
module.exports = function (passport) {
  var AuthLocalStrategy = require('passport-local').Strategy;
//var AuthFacebookStrategy = require('passport-facebook').Strategy;
//var AuthVKStrategy = require('passport-vkontakte').Strategy;


  var AuthError = require('../db/schemas/User').AuthError;
  var HttpError = require('../utils/HttpError').HttpError;

  var User = require('../db/models/User').mUser;
// ================= Конфигурация Стратегий  =============================
  /**
   * Стратегия Локальной Авторизации.
   */
  passport.use('local', new AuthLocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
      },
      function (username, password, done) {
        User.findOne({email: username}, function (err, user) {//-> Ищем пользователя в БД по email(он же логин)
          if (err) {
            return done(err);
          }
          if (!user) {//-> пользователь по email не найден в БД
            done(null, false, {message: 'Не верное имя пользователя'});
          }
          if (!user.checkPassword(password)) { //-> Проверяем пароль
            done(null, false, {message: 'Не верный Пароль'});
          }
          done(null, user); //-> Все ОК отдаем Pasport(у) пользователя
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
    User.findById(user_id, function (err, user) {
      done(err, user);
    });
  });
};