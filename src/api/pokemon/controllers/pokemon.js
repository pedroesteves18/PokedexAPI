const firstGen = require("./firstGen.js");

module.exports = {
	async list(ctx) {
		try {
			const pokemons = await strapi.entityService.findMany(
				"api::pokemon.pokemon"
			);
			ctx.body = {
				data: pokemons,
			};
		} catch (error) {
			console.log("Error listing pokemons", error.message);
			ctx.throw(500, "Error listing pokemons", error.message);
		}
	},

	async populatePokemons(ctx) {
		try {
			const result = await strapi
				.service("api::pokemon.pokemon")
				.populatePokemons();
			ctx.send({ msg: result.message });
		} catch (error) {
			ctx.badRequest("Error populating pokemons: " + error.message);
		}
	},
};
