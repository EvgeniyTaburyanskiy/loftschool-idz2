var logger = require('../utils/winston')(module);

/* GET home page. */
var home = function (req, res, next) {
      res.render('index', {title: 'home'});
    };

module.exports = {
  home: home
};
