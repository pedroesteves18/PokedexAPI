const helpers = require("./helpers.js");
const { errors, async } = require("@strapi/utils");
const { ApplicationError } = errors;

module.exports = {
	async list(ctx) {
		try {
			const result = await strapi
				.service("api::pokemon-pokedex.pokemon-pokedex")
				.list(ctx);
			ctx.send(result);
		} catch (error) {
			ctx.badRequest(
				"Error listing pokemons in the pokedex" + error.message
			);
		}
	},

	async addPokemon(ctx) {
		try {
			const result = await strapi
				.service("api::pokemon-pokedex.pokemon-pokedex")
				.addPokemon(ctx);
			ctx.send(result);
		} catch (error) {
			ctx.badRequest(error.message);
		}
	},
	async sendPokemon(ctx) {
		try {
			const result = await strapi
				.service("api::pokemon-pokedex.pokemon-pokedex")
				.sendPokemon(ctx);
			ctx.send(result);
		} catch (error) {
			ctx.badRequest(
				"Error sending pokemon to the trainer: " + error.message
			);
		}
	},
	async gainXp(ctx) {
		try {
			const result = await strapi
				.service("api::pokemon-pokedex.pokemon-pokedex")
				.gainXp(ctx);
			ctx.send(result);
		} catch (error) {
			ctx.badRequest(error.message);
		}
	},
	async evolvePokemon(ctx) {
		try {
			const result = await strapi
				.service("api::pokemon-pokedex.pokemon-pokedex")
				.evolvePokemon(ctx);
			ctx.send(result);
		} catch (error) {
			ctx.badRequest(error.message);
		}
	},
};
