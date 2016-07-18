/**
 * Вспомогательная схема для Коллекции пользвователей
 * Не создаем отдельную моель для нее. А просто используем как вложенный тип данных с заданной схемой.
 *
 * http://mongoosejs.com/docs/subdocs.html
 */

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Схема Коллекции Личных Данных Пользователей
 */
var schemaUserData = new Schema({
  name:    {
    type:      String,
    default:   'Без Имени',
    minlength: 1,
    maxlength: 100,
    trim:      true,
    required:  true
  },
  message: {
    type:      String,
    default:   '',
    maxlength: 250,
    trim:      true,
    required:  false
  },
  avatar:  {
    type:      String,
    default:   '/images/no-avatar.png',
    maxlength: 2000, // https://www.boutell.com/newfaq/misc/urllength.html
    trim:     true,
    required: true
  },
  imgURL:  {
    type:      String,
    default:   '/images/no-user-bg.png',
    maxlength: 2000, // https://www.boutell.com/newfaq/misc/urllength.html
    trim:     true,
    required: true
  },
  email:   {
    type:      String,
    maxlength: 254, // http://www.rfc-editor.org/errata_search.php?rfc=3696&eid=1690
    trim:     true,
    required: true
  },
  fb:      {
    type:      String,
    default:   '',
    maxlength: 2000, // https://www.boutell.com/newfaq/misc/urllength.html
    trim:     true,
    required: false
  },
  tw:      {
    type:      String,
    default:   '',
    maxlength: 2000, // https://www.boutell.com/newfaq/misc/urllength.html
    trim:     true,
    required: false
  },
  vk:      {
    type:      String,
    default:   '',
    maxlength: 2000, // https://www.boutell.com/newfaq/misc/urllength.html
    trim:     true,
    required: false
  },
  g:       {
    type:      String,
    default:   '',
    maxlength: 2000, // https://www.boutell.com/newfaq/misc/urllength.html
    trim:     true,
    required: false
  }
});

// ================= UserData Validators =============================
schemaUserData.path('email').validate(
    function (email) { //-> http://emailregex.com/
      var emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      return emailRegex.test(email); // Assuming email has a text attribute
    },
    'Поле Email не может быть пустым'
);

//var modelUserData = mongoose.model('UserData', schemaUserData);

module.exports.sUserData = schemaUserData;

