var logger = require('../utils/winston')(module);
var HttpError = require('../middleware/HttpError').HttpError;

/* GET albums page. */
var get = function (req, res, next) {
  // TODO: Обрабатывать reques там может быть задан ID альбома ?album_id=Num
  res.render('person', {
    title: 'person'
  });
};


/* GET album by ID. */
var getById = function (req, res, next) {
  var ID = req.params.id;

  res.render('album', {
    title: 'album By ID'
  });
};


exports = module.exports = {
  get:     get,
  getById: getById
};

