var express        = require('express'),
    app            = express(),
    path           = require('path'),
    cookieParser   = require('cookie-parser'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    favicon        = require('serve-favicon'),
    passport       = require('passport');

var cwd    = process.cwd(),
    utils  = cwd + '/utils/',
    config = require(utils + 'nconf'),
    log    = require(utils + 'winston')(module);

var documentRoot = path.join(cwd, config.get('documentRoot'));
var viewsDir = path.join(cwd, config.get('viewsDir'));

/**
 * EXPRESS CONFIG
 */

// view engine setup
app.set('view engine', 'pug');
app.set('views', viewsDir);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(cwd , 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(methodOverride());
app.use(express.static(documentRoot));
app.use(passport.initialize());

/**
 * ROUTING WORKERS
 */
var r_root = require(cwd + '/routes/root');       //-> Обработчик Маршрута Гланая стр
var r_auth = require(cwd + '/routes/auth');       //-> Обработчик Маршрута Авторизация/Регистрация/Восстановление пароля
var r_album = require(cwd + '/routes/album');     //-> Обработчик Маршрута Альбом редактирвание
var r_user = require(cwd + '/routes/user');       //-> Обработчик Маршрута Пользователь-Альбомы
var r_search = require(cwd + '/routes/search');   //-> Обработчик Маршрута Результаты поиска
//var r_api = require(cwd + '/routes/api');       //->

app.use('/', r_root);
app.use('/auth', r_auth);
app.use('/album', r_album);
app.use('/user', r_user);
app.use('/search', r_search);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  log.debug('%s %d %s', req.method, res.statusCode, req.url);
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    log.error('%s %d %s', req.method, res.statusCode, err.message);
    res.render('error', {
      message: err.message,
      error:   err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  log.error('%s %d %s', req.method, res.statusCode, err.message);
  res.render('error', {
    message: err.message,
    error:   {}
  });
});

module.exports = app;