/**
 * Module dependencies.
 */
var logger = require('../utils/winston')(module);
var http = require('http');
var util = require('util');
var js2xmlparser = require("js2xmlparser");
var ENV = process.env.NODE_ENV;

/*
 {
 "message":          "Описание ошибки, предназначенное для разработчика",
 "type":             "AuthException",
 "code":             "Код ошибки.",
 "error_subcode":    "Дополнительная классификация ошибки.",
 "error_user_title": "Заголовок диалога об ошибке, который следует использовать, если диалог отображается для   пользователя   ",
 "error_user_msg":   "Этот параметр указывает, что сообщение необходимо показать пользователю"
 }
 */
var errorsList = {
  400: {
    "DEFAULT":             {
      "message":          "Некорректный запрос",
      "type":             "",
      "code":             "400",
      "error_subcode":    "",
      "error_user_title": "",
      "error_user_msg":   "Некорректный запрос"
    },
    "ILLEGAL_PARAM_VALUE": {
      "message":          "Неверное значение передаваемого параметра",
      "type":             "",
      "code":             "400",
      "error_subcode":    "",
      "error_user_title": "",
      "error_user_msg":   "Некорректный запрос"
    }
  },
  401: {
    "DEFAULT": {
      "message":          "Необходима Авторизация",
      "type":             "",
      "code":             "401",
      "error_subcode":    "",
      "error_user_title": "",
      "error_user_msg":   "Необходима Авторизация"
    },
    //Имя пользователя уже занято
  },
  403: { //-> Ошибки Доступа к ресурсам из-за недостатка прав.
    "DEFAULT": {
      "message":          "Доступ Запрещен",
      "type":             "",
      "code":             "403",
      "error_subcode":    "",
      "error_user_title": "",
      "error_user_msg":   ""
    },

  },
  404: {//-> Ошибки валидации параметров запроса.
    "DEFAULT":               {
      "message":          "Запрошеный ресурс не найден",
      "type":             "",
      "code":             "404",
      "error_subcode":    "",
      "error_user_title": "",
      "error_user_msg":   "Запрошеный ресурс не найден"
    },
    'REQUIRED_PARAM_MISSED': {
      "message":          "отсутствует обязательный параметр",
      "type":             "",
      "code":             "",
      "error_subcode":    "",
      "error_user_title": "",
      "error_user_msg":   ""
    }
  },
  500: { //-> Внутренняя ошибка сервера.
    "DEFAULT": {
      "message":          "Внутренняя ошибка сервера.",
      "type":             "",
      "code":             "500",
      "error_subcode":    "",
      "error_user_title": "",
      "error_user_msg":   ""
    },
  }
};

/**
 * MiddleWare Обрабатывает ошибки Http котрые мы генерим по коду приложения с помощью собственного объекта ошибки
 * HttpError.
 * На AJAX запросы отдает инфо об ошибке в виде JSON  иначе в виде рендера страницы Ошибки.
 *
 * https://tech.yandex.ru/webmaster/doc/dg/reference/errors-docpage/
 * https://developers.facebook.com/docs/graph-api/using-graph-api/#errors
 * http://great-world.ru/kody-otvetov-servera-i-oshibki-http-200-301-404-302-500-503-550/#401
 *
 * @param req
 * @param res
 * @param next
 */
var sendHttpError = function (req, res, next) {
  res.sendHttpError = function (error) {
    res.status(error.status);
    // Формируем ответ по кодам ошибок
    var errData = errorsList[500]["DEFAULT"];

    if ('undefined' !== errorsList[error.status]) {
      var majorErr = errorsList[error.status];
      res.status(error.status);
      errData = majorErr["DEFAULT"];
      if (error.subcode in majorErr) {
        errData = majorErr[error.subcode];
      }
    }
    errData.stacktrace = (ENV === 'development') ? error.stack : ''; //-> Дополняем трассировкой ошибки для режима DEv
    errData.message = error.message || errData.message; //-> Заменяем стандартное сообщение из списка кодов на "всплывшее" из приложения

    // Если запрос был по AJAX то ответ отдаем через Json req.xhr
    if (res.req.headers['x-requested-with'] == 'XMLHttpRequest') {
      res.json(errData);
    }
    // все что не 404 отдаем в XML так удобно читать
    else if (404 !== parseInt(errData.code)) {
      res.set('Content-Type', 'text/xml');
      res.send(js2xmlparser("error", errData));
    }
    // Если стстаус 404 рендерим страницу ошибки и отдаем данные как объект res.locals
    else {
      res.render('error',
          {
            message: errData.message,
            error:   JSON.stringify(errData)
          }
      );
    }

    logger.debug('%s %d %s', req.method, res.statusCode, error.message + ' [' + req.url + ']');
  };
  next();
}


/**
 * Собственная Ошибка для Http.
 * @param status
 * @param message *Optional
 * @constructor
 */
var HttpError = function (status, subcode, message) {
  Error.apply(this, arguments); //-> обрабатываем поступившие параметры в контексте нашего объекта ошибки.
  // Стандартным обработчиком ошибок
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, HttpError);//-> Забираем весь стек сообщений и данных получившихся после стандарной обработки
  } else {
    this.stack = (new Error()).stack;
  }

  this.status = status; //-> устанавливаем наш статус код (401,500,403,....)
  this.subcode = subcode; //-> Устанавливаем наш Под Код. (см sendHttpError)
  /*
   * применяем сообщение либо по коду пытаемся
   * получить стандартное описание http ошибки по ее коду , либо на крайий случай просто отдаем текст Error
   * */
  this.message = message || http.STATUS_CODES[status] || 'Error'; //->
}

util.inherits(HttpError, Error);
HttpError.prototype.name = 'HttpError';
/*HttpError.prototype.toJSON = function () {
 return { }
 };*/

module.exports.HttpError = HttpError;
module.exports.sendHttpError = sendHttpError;