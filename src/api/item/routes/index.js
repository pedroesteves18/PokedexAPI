'use strict';

const itemRoutes = require('./item.js');

module.exports = {
  routes: [...itemRoutes.routes],
};