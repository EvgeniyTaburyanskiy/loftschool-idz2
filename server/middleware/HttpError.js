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
var apiErrorsList = {
  200: {
    "DEFAULT": {
      "message":          "Запрос успешно принят и обработан",
      "type":             "",
      "code":             "200",
      "error_subcode":    "",
      "error_user_title": "Ok",
      "error_user_msg":   "Запрос успешно принят и обработан",
      "data":             {}
    }
  },
  400: {
    "DEFAULT":             {
      "message":          "Некорректный запрос",
      "type":             "",
      "code":             "400",
      "error_subcode":    "",
      "error_user_title": "",
      "error_user_msg":   "Некорректный запрос",
      "data":             {}

    },
    "ILLEGAL_PARAM_VALUE": {
      "message":          "Неверное значение передаваемого параметра",
      "type":             "",
      "code":             "400",
      "error_subcode":    "",
      "error_user_title": "",
      "error_user_msg":   "Некорректный запрос",
      "data":             {}
    }
  },
  401: {
    "DEFAULT": {
      "message":          "Необходима Авторизация",
      "type":             "",
      "code":             "401",
      "error_subcode":    "",
      "error_user_title": "",
      "error_user_msg":   "Необходима Авторизация",
      "data":             {}
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
      "error_user_msg":   "",
      "data":             {}
    },

  },
  404: {//-> Ошибки валидации параметров запроса.
    "DEFAULT":               {
      "message":          "Запрошеный ресурс не найден",
      "type":             "",
      "code":             "404",
      "error_subcode":    "",
      "error_user_title": "",
      "error_user_msg":   "Запрошеный ресурс не найден",
      "data":             {}
    },
  },
  500: { //-> Внутренняя ошибка сервера.
    "DEFAULT": {
      "message":          "Внутренняя ошибка сервера.",
      "type":             "",
      "code":             "500",
      "error_subcode":    "",
      "error_user_title": "",
      "error_user_msg":   "",
      "data":             {}
    },
  }
};
/**
 * MiddleWare Обрабатывает ошибки Http котрые мы генерим по коду приложения с помощью собственного объекта ошибки
 * HttpError.
 * Предназначен ля вывода ошибок ПУБЛИЧНЫХ маршрутов
 * Рендерит 404 на все ошибки кроме 500.
 */
var sendHttpError = function (req, res, next) {
  res.sendHttpError = function (error) {
    if (500 === parseInt(error.status)) {
      res
      .status(500)
      .render('error',
          {
            message: error.message
          }
      );
    }
    else {
      res
      .status(404)
      .render('error',
          {
            message: error.message
          }
      );
    }

    logger.debug('PUBLIC ERR- %s %d %s', req.method, res.statusCode, error.message + ' [' + req.url + ']');
  };
  next();
};

/**
 * MiddleWare Обрабатывает ошибки Http котрые мы генерим по коду приложения с помощью собственного объекта ошибки
 * HttpError.
 * Предназначен ля вывода ошибок API маршрутов
 * На AJAX запросы отдает инфо об ошибке в виде JSON  иначе в виде XML страницы Ошибки.
 *
 * https://tech.yandex.ru/webmaster/doc/dg/reference/errors-docpage/
 * https://developers.facebook.com/docs/graph-api/using-graph-api/#errors
 * http://great-world.ru/kody-otvetov-servera-i-oshibki-http-200-301-404-302-500-503-550/#401
 *
 * @param req
 * @param res
 * @param next
 */
var sendAPIHttpError = function (req, res, next) {
  res.sendAPIHttpError = function (error) {

    // По умолчанию всем отвечаем что все Отлично! :)
    res.status(200);
    var errData = apiErrorsList[200]["DEFAULT"];
    // Формируем ответ по кодам ошибок
    // Находим ошибку в листинге наших ошибок
    if ('undefined' !== apiErrorsList[error.status]) {
      var majorErr = apiErrorsList[error.status];
      res.status(error.status);
      errData = majorErr["DEFAULT"];
      if (error.subcode in majorErr) {
        errData = majorErr[error.subcode];
      }
    }
    errData.stacktrace = (ENV === 'development') ? error.stack : ''; //-> Дополняем трассировкой ошибки для режима DEv
    errData.error_user_msg = error.message || errData.message;       //-> Заменяем стандартное сообщение из списка кодов на "всплывшее" из приложения
    errData.data = error.data || errData.data;                       //-> Отдаем "вплывшие" данные из приложения

    // Если запрос был по AJAX то ответ отдаем через Json req.xhr
    if (req.xhr || res.req.headers['x-requested-with'] == 'XMLHttpRequest') {
      res.json(errData);
    }
    // все остальне отдаем в XML так удобно читать
    else {
      res.set('Content-Type', 'text/xml');
      res.send(js2xmlparser("result", errData));
    }

    logger.debug('API ERR- %s %d %s', req.method, res.statusCode, error.message + ' [' + req.url + ']');
  };
  next();
};


/**
 * Собственная Ошибка для Http.
 * @param status
 * @param message *Optional
 * @constructor
 */
var HttpError = function (status, subcode, message, data) {
  Error.apply(this, arguments); //-> обрабатываем поступившие параметры в контексте нашего объекта ошибки.
  // Стандартным обработчиком ошибок
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, HttpError); //-> Забираем весь стек сообщений и данных получившихся после стандарной обработки
  } else {
    this.stack = (new Error()).stack;
  }

  this.status = status;   //-> устанавливаем наш статус код (200,300,401,500,..)
  this.subcode = subcode; //-> Устанавливаем наш Под Код. (см sendHttpError)
  /*
   * применяем сообщение либо по коду пытаемся
   * получить стандартное описание http ошибки , либо на крайий случай просто отдаем текст Error
   * */
  this.message = message || http.STATUS_CODES[status] || 'Error'; //->
  /*
   Если нужно передать обработчику данные то отдаем их через data.
   Например с кодом 200 отдаем данные пользователя в API
   */
  this.data = data || {};//->
}

util.inherits(HttpError, Error);
HttpError.prototype.name = 'HttpError';
/*HttpError.prototype.toJSON = function () {
 return { }
 };*/

exports = module.exports = {
  HttpError:        HttpError,
  sendHttpError:    sendHttpError,
  sendAPIHttpError: sendAPIHttpError
};