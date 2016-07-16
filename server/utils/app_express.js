var express        = require('express'),
    app            = express(),
    path           = require('path'),
    cookieParser   = require('cookie-parser'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    favicon        = require('serve-favicon'),
    passport       = require('passport');


var
    config = require('./nconf'),
    logger = require('./winston')(module);

var serverRoot = config.get('serverRoot');
var documentRoot = path.join(serverRoot, config.get('documentRoot'));
var viewsDir = path.join(serverRoot, config.get('viewsDir'));

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
var r_root = require(serverRoot + '/routes/root');       //-> Обработчик Маршрута Гланая стр
var r_auth = require(serverRoot + '/routes/auth');       //-> Обработчик Маршрута Авторизация/Регистрация/Восстановление пароля
var r_albums = require(serverRoot + '/routes/albums');     //-> Обработчик Маршрута Альбом редактирвание
var r_users = require(serverRoot + '/routes/users');       //-> Обработчик Маршрута Пользователь-Альбомы
var r_search = require(serverRoot + '/routes/search');   //-> Обработчик Маршрута Результаты поиска
//var r_api = require(cwd + '/routes/api');       //->

app.use('/', r_root);
app.use('/auth', r_auth);
app.use('/albums', r_albums);
app.use('/users', r_users);
app.use('/search', r_search);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  logger.debug('%s %d %s', req.method, res.statusCode, req.url);
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    logger.error('%s %d %s', req.method, res.statusCode, err.message);
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
  logger.error('%s %d %s', req.method, res.statusCode, err.message);
  res.render('error', {
    message: err.message,
    error:   {}
  });
});

module.exports = app;