var logger = require('../../utils/winston')(module);
var HttpError = require('../../middleware/HttpError').HttpError;

/* GET search page. */
var search = function (req, res, next) {
  res.render('index_', {title: 'search'});
};

module.exports.search = search;
