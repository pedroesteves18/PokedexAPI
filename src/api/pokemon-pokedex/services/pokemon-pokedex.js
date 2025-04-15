'use strict';

/**
 * pokemon-pokedex service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::pokemon-pokedex.pokemon-pokedex');
