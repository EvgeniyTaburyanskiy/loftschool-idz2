/**
 * Module dependencies.
 */
var winston = require('winston');
var path = require('path');
var ENV = process.env.NODE_ENV;

winston.emitErrs = true;

function getLogger(module) {
  //var modulePath = module.filename.split('/').slice(-2).join('/'); //-> for Nix OS
  var modulePath = module.filename.split('\\').slice(-2).join('/');

  return new winston.Logger({
    transports:  [
      new winston.transports.File({
        level:           ENV === 'development' ? 'debug' : 'error',
        filename:        path.join(__dirname, '/../logs/all.log'),
        handleException: true,
        json:            true,
        maxSize:         5242880, //5mb
        maxFiles:        2,
        colorize:        false
      }),
      new winston.transports.Console({
        level:           ENV === 'development' ? 'debug' : 'error',
        label:           modulePath,
        handleException: true,
        json:            false,
        colorize:        true
      })
    ],
    exitOnError: false
  });
}

module.exports = getLogger;
