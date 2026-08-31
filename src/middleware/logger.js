'use strict';

// use of `next` allows Express to continue after logging
function logger(req, res, next) {
  console.log(`${req.method} ${req.path}`);
  next();
}

module.exports = logger;