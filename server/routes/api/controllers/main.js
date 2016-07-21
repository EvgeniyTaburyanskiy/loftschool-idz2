/**
 * Module dependencies.
 */
var logger = require('../../../utils/winston')(module);
var HttpError = require('../../../middleware/HttpError').HttpError;
/**
 * API Home.
 * @param req
 * @param res
 */
var API_home = function (req, res) {
  res.json(new HttpError(200));
};

exports = module.exports = {
  api_home: API_home
};
