'use strict';

const pokemonRoutes = require('./pokemon.js');

module.exports = {
  routes: [...pokemonRoutes.routes],
};