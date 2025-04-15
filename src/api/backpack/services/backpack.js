'use strict';

/**
 * backpack service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::backpack.backpack');
