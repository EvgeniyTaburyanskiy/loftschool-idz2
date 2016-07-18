/**
 * Module dependencies.
 */
var express        = require('express'),
    app            = express(),
    path           = require('path'),
    morgan         = require('morgan'),
    cookieParser   = require('cookie-parser'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    sendHttpError  = require('../middleware/sendHttpError'),
    loadUser       = require('../middleware/loadUser'),
    expressSession = require('express-session'),
    MongoStore     = require('connect-mongo')(expressSession),
    passport       = require('passport'),
    helmet         = require('helmet');

var
    config   = require('./nconf'),
    logger   = require('./winston')(module),
    router   = require('../routes'),
    mongoose = require('./mongoose');

var serverRoot = config.get('serverRoot');
var documentRoot = path.join(serverRoot, config.get('documentRoot'));
var viewsDir = path.join(serverRoot, config.get('viewsDir'));

/**
 * EXPRESS CONFIG
 */

app.use(helmet());

app.set('view engine', 'pug');
app.set('views', viewsDir);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(cwd , 'public', 'favicon.ico')));
if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}
app.use(bodyParser.json()); // req.body
app.use(bodyParser.urlencoded({extended: false}));

//app.use(methodOverride());
app.use(cookieParser());    // req.cookies
app.use(expressSession({
      secret:            config.get('session:secret'),
      name:              config.get('session:key'),
      cookie:            config.get('session:cookie'),
      store:             new MongoStore({
        mongooseConnection: mongoose.connection
      }),
      resave:            false, //don't save session if unmodified
      saveUninitialized: false // don't create session until something stored
    })
);

app.use(sendHttpError);
app.use(loadUser);

app.use(express.static(documentRoot));
app.use(passport.initialize());


/**
 * MAIN ROUTING MODULE
 * */
app.use(router(app));

module.exports = app;