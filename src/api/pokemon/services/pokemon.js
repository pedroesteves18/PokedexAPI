"use strict";
const firstGen = require("../controllers/firstGen.js");
const errors = require("@strapi/utils").errors;
const { ApplicationError } = errors;
/**
 * pokemon service
 */

module.exports = {
	async populatePokemons() {
		try {
			const existing = await strapi.entityService.findMany(
				"api::pokemon.pokemon"
			);
			if (existing.length > 0) {
				return {
					inserted: false,
					message: "Pokemons already registered!",
				};
			}

			await Promise.all(
				firstGen.map(async (pokemon) => {
					await strapi.entityService.create("api::pokemon.pokemon", {
						data: {
							type1: pokemon.type1,
							type2: pokemon.type2,
							name: pokemon.name,
							evolutionLevel: pokemon.evolutionLevel,
						},
					});
				})
			);

			return {
				inserted: true,
				message: "Pokemons were inserted successfully!",
			};
		} catch (error) {
			throw new ApplicationError(
				`populatePokemons failed: ${error.message}`
			);
		}
	},
};
