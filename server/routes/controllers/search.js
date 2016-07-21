var logger = require('../../utils/winston')(module);
var HttpError = require('../../middleware/HttpError').HttpError;

/* GET search page. */
var getSearch = function (req, res, next) {
  res.render('search',
      {
        title: 'search'
      }
  );
};

exports = module.exports = {
  search: getSearch
};
