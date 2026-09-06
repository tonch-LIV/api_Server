'use strict';

const express = require('express');
const cors = require('cors');

const logger = require('./middleware/logger.js');

const foodRouter = require('./routes/food.js');
const ingredientRouter = require('./routes/ingredients.js');

const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');

const app = express();

// app-level middleware
app.use(cors());  // 1.
app.use(express.json());  // 2.
app.use(logger);  // 3.

// REST routers
app.use(foodRouter);  // 4.
app.use(ingredientRouter);  // 4.

// error handlers; must follow routes
app.use(notFoundHandler);  // 5.
app.use(errorHandler);  // 6.

function start(port) {
  app.listen(port, () => {
    console.log(`Server up on port ${port}`);
  });
}
// executes in registration order ^^


module.exports = {
  app,
  start,
};