var nconf = require('nconf');
var path   = require('path');

nconf
.argv()
.env()
.file({
  file: __dirname + '/../config/local.env.json'
});

module.exports = nconf;