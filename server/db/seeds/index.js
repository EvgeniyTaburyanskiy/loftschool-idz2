/**
 * Module dependencies.
 */
var logger = require('../../utils/winston')(module);
var async = require('async');
var mongoose = require('mongoose');

var seeders = {
  seedUsers: require('./seedUsers')
};


mongoose.connection.on('open', function () {
  var db = mongoose.connection.db;

  db.dropDatabase(function (err) {
    if (err) throw err;
    async.parallel(
        seeders,
        function (err, result) {
          logger.debug(arguments);
          mongoose.disconnect();
        });
  });
});
