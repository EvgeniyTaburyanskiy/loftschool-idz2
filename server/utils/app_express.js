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
    logger = require('./winston')(module),
    router = require('../routes');

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
 * Start Routing
 * */
app.use(router(app));

module.exports = app;