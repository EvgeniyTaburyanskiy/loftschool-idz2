var logger = require('../utils/winston')(module);


var login = function (req, res, next) {
  res.render('index', {title: 'login'});
};

var register = function (req, res, next) {
  res.render('index', {title: 'register'});
};

var fogot = function (req, res, next) {
  res.render('index', {title: 'fogot'});
};


module.exports = {
  login:    login,
  register: register,
  fogot:    fogot
};
