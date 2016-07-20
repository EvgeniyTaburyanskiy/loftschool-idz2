/**
 * Module dependencies.
 */
var logger = require('../../utils/winston')(module);

/**
 * API Home.
 * @param req
 * @param res
 */
var API_home = function (req, res) {
  res.json({});
};

exports = module.exports = {
  api_home: API_home
};
