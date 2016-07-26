/**
 * Module dependencies.
 */
var logger = require('../../utils/winston')(module);

/* GET home page. */
var getHome = function (req, res) {
  function getUserAlbums(){}
  
  res.render('main',
      {
        title: 'HOME',
        csrfToken: req.csrfToken(),
        newPotos: []
      }
  );
};

exports = module.exports = {
  getHome: getHome
};
