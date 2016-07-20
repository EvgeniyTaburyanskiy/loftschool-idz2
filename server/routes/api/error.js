/**
 * Module dependencies.
 */
var logger = require('../../utils/winston')(module);
var ENV = process.env.NODE_ENV;
var HttpError = require('../../middleware/HttpError').HttpError;
var express = require('express');


// catch 404 and forward to error handler
var err_404 = function (req, res, next) {
  var err = new HttpError(404);
  next(err);
};

var err_all = function (err, req, res, next) {

  // Все Http ошибки и просто с цифроыми кодами обрабатываем сами
  if (typeof  err === 'number') {
    err = new HttpError(err);
  }
  // Проверяем на ошибку  проверки CSRF токена
  if (err.code === 'EBADCSRFTOKEN') { //-> Ошибка проверки токена CSRF
    err = new HttpError(400, 'EBADCSRFTOKEN', err.message);
  }

  // Все ошибки нашего класса  обрабатываем собственным  middleware sendHttpError
  if (err instanceof HttpError) {
    res.sendAPIHttpError(err);
  }
  // Все остальные Ошибки если в продакшене то отдаем в sendHttpError как 500 ,либо если дев режиме то отдаем Express
  else {
    if (ENV === 'development') {
      // В Dev смотрим что произошло и разрешаем Express(у) решать как дальше поступать.
      logger.debug('%s %d %s', req.method, res.statusCode, err.message);
      return next(err);
    } else {
      // Что бы сервак в продакшене не падал . Обрабатываем все ошибки как 500.
      err = new HttpError(500); //-> Все ошибки которые мы не обработали ранее помечаем как 500 и отдаем клиенту.
      res.sendAPIHttpError(err);
    }
  }
};


module.exports.err_404 = err_404;
module.exports.err_all = err_all;

