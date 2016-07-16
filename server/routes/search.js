var logger = require('../utils/winston')(module);

/* GET search page. */
var search = function (req, res, next) {
  res.render('index', {title: 'search'});
};

module.exports = {
  search: search
};
