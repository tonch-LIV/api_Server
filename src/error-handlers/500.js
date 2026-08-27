'use strict';

function errorHandler(error, req, res, next) {
  res.status(500).send({
    error: 500,
    route: req.path,
    query: req.query,
    message: `Server Error: ${error.message}`,
  });
}

module.exports = errorHandler;