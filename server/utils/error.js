var http = require('http');
var util = require('util');

/**
 * Собственная Ошибка для Http.
 * @param status
 * @param message *Optional
 * @constructor
 */
function HttpError(status, message) {
  Error.apply(this, arguments); //-> обрабатываем поступившие параметры в контексте нашего объекта ошибки.
  // Стандартным обработчиком ошибок
  Error.captureStackTrace(this, HttpError);//-> Забираем весь стек сообщений и данных получившихся после стандарной обработки

  this.status = status; //-> устанавливаем наш статус
  this.message = message || http.STATUS_CODES[status] || 'Error'; //-> применяем сообщение либо по коду пытаемся
  // получить стандартное описание http ошибки по ее коду  либо на крайий случай просто отдаем текст Error
}

util.inherits(HttpError, Error);
HttpError.prototype.name = 'HttpError';
exports.HttpError = HttpError;