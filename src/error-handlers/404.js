'use strict';

function notFoundHandler(req, res) {
  res.status(404).send({
    error: 404,
    route: req.path,
    message: 'Not Found',
  });
}

module.exports = notFoundHandler;