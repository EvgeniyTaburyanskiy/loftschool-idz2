var logger = require('../utils/winston')(module);
var HttpError = require('../middleware/HttpError').HttpError;

/* GET albums page. */
var get = function (req, res, next) {
  // 
  res.render('album', {
    title: 'albums'
  });
};


/* GET album by ID. */
var getById = function (req, res, next) {
  var ID = req.params.id;
  
  res.render('album', {
    title: 'album'
  });
};


exports = module.exports = {
  get:     get,
  getById: getById
};

