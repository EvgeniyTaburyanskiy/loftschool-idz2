var User = require('../models/User');




module.exports = function (callback) {
  var admin = new User({
    email:    'admin@loftogrm.ru',
    password: 'admin'
  });
  
  admin.save(function (err) {
    callback(err, admin);
  })
};