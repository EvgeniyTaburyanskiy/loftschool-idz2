/**
 * Module dependencies.
 */
var logger = require('../../utils/winston')(module);

/* GET home page. */
var getHome = function (req, res) {
  res.render('main',
      {
        title: 'HOME',
        csrfToken: req.csrfToken()
      }
  );
};

exports = module.exports = {
  getHome: getHome
};
