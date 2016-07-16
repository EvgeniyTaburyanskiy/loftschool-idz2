var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaUser = new Schema({

});

var modelUser = mongoose.model('User', schemaUser);

modules.exports = modelUser;

