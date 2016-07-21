/**
 * Module dependencies.
 */
var express          = require('express'),
    app              = express(),
    path             = require('path'),
    morgan           = require('morgan'),
    cookieParser     = require('cookie-parser'),
    bodyParser       = require('body-parser'),
    methodOverride   = require('method-override'),
    sendHttpError    = require('../middleware/HttpError').sendHttpError,
    sendAPIHttpError = require('../middleware/HttpError').sendAPIHttpError,
    loadUser         = require('../middleware/loadUser'),
    expressSession   = require('express-session'),
    MongoStore       = require('connect-mongo')(expressSession),
    passport         = require('passport'),
    helmet           = require('helmet'),
    flash            = require('express-flash');

var
    config       = require('./nconf'),
    logger       = require('./winston')(module),
    publicRouter = require('../routes').Router,
    apiRouter    = require('../routes/api').Router,
    mongoose     = require('./mongoose');

var serverRoot = path.join(__dirname, '/../');
var documentRoot = path.join(serverRoot, config.get('documentRoot'));
var viewsDir = path.join(serverRoot, config.get('viewsDir'));
var sessionOptions = {
  secret:            config.get('session:secret'),
  name:              config.get('session:key'),
  cookie:            config.get('session:cookie'),
  store:             new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  resave:            false, //don't save session if unmodified
  saveUninitialized: false // don't create session until something stored
};

/**
 * EXPRESS CONFIG
 */

app.use(helmet());

app.set('view engine', 'pug');
app.set('views', viewsDir);

//if behind a reverse proxy such as Varnish or Nginx
//app.enable('trust proxy');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(cwd , 'public', 'favicon.ico')));
if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}
app.use(express.static(documentRoot));
app.use(bodyParser.json()); //-> req.body
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride());
app.use(cookieParser());    //-> req.cookies
app.use(expressSession(sessionOptions));

app.use(flash());           //-> res.locals.messages
app.use(sendAPIHttpError);  //->  добавляем Обработчик ошибок API интерфейса (res.sendAPIHttpError)
app.use(sendHttpError);     //-> добавляем Обработчик ошибок публичного интерфейса (res.sendHttpError)
app.use(passport.initialize());
app.use(passport.session());

/**
 * MAIN ROUTING MODULE
 * */
app.use(apiRouter(app));
app.use(publicRouter(app));
app.use(loadUser);


module.exports = app;