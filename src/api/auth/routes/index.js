'use strict';

const userRoutes = require('./auth.js');

module.exports = {
  routes: [...userRoutes.routes],
};