'use strict';

/**
 * pokedex controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::pokedex.pokedex');
