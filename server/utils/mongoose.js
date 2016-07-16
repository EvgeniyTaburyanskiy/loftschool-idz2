var mongoose = require('mongoose');

var
    config = require('./nconf'),
    logger = require('./winston')(module);

var serverRoot = config.get('serverRoot');

/*http://mongoosejs.com/docs/connections.html*/
mongoose.connect(  
    config.get('db:connection') + '/' + config.get('db:name'),
    config.get('db:options')
);

var db = mongoose.connection;

db.on('error', function (err) {
  logger.error('Connection error:', err.message);
});

db.once('open', function callback () {
  logger.info("Connected to DB!");
});

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    logger.info('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

module.exports = mongoose;