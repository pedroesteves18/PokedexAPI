'use strict';

/**
 * pokedex router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::pokedex.pokedex');
