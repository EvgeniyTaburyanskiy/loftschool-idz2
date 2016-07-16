var logger = require('../utils/winston')(module);

/* GET users page. */
var getUsers = function (req, res, next) {
  res.render('index', {title: 'albums'});
};

/* GET user by ID. */
var getUserById = function (req, res, next) {
  res.render('index', {title: 'album'});
};


module.exports = {
  users: getUsers,
  user:  getUserById
};
