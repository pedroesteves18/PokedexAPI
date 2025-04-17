const helpers = require("./helpers.js");
module.exports = {
	async list(ctx) {
		try {
			let trainerId = await helpers.haveToken(ctx);
			if (!trainerId) {
				ctx.badRequest("Trainer needs to be logged in!");
			}
			let trainer = await strapi.entityService.findOne(
				"plugin::users-permissions.user",
				trainerId,
				{
					populate: {
						pokedex: {
							populate: {
								PokemonPokedex: {
									populate: ["pokemon"],
								},
							},
						},
					},
				}
			);

			ctx.send(trainer.pokedex.PokemonPokedex);
		} catch (error) {
			ctx.badRequest(
				"Error listing pokemons in the pokedex" + error.message
			);
		}
	},

	async addPokemon(ctx) {
		try {
			const { pokemonId, level, nickname } = ctx.request.body;

			const trainer = await helpers.getTrainer(ctx);
			console.log(trainer);

			const pokemon = await strapi.entityService.findOne(
				"api::pokemon.pokemon",
				pokemonId
			);
			let pokemonPokedex = await strapi.entityService.create(
				"api::pokemon-pokedex.pokemon-pokedex",
				{
					data: {
						pokedex: trainer.pokedex.id,
						pokemon: pokemon.id,
						pokemonId: pokemonId,
						level: level,
						nickname: nickname,
					},
				}
			);
			ctx.send(pokemonPokedex);
		} catch (error) {
			ctx.badRequest(error.message);
		}
	},
	async removePokemon(ctx) {
		try {
			let data = ctx.request.body;

			const trainer = await helpers.getTrainer(ctx);

			let deletedPokemon = await helpers.deletePokemon(
				ctx,
				trainer,
				data.pokemonId
			);
			if (!deletedPokemon) {
				ctx.badRequest("Pokemon not found in the trainer Pokedex");
			} else {
				ctx.send("Pokemon deleted from Pokedex");
			}
		} catch (error) {
			ctx.badRequest(error.message);
		}
	},
	async sendPokemon(ctx) {
		try {
			let { pokemonId, otherTrainerId } = ctx.request.body;
			let trainer = await helpers.getTrainer(ctx);

			let sendedPokemon = await helpers.sendPokemon(
				trainer,
				pokemonId,
				otherTrainerId
			);

			if (sendedPokemon === false) {
				return ctx.send(
					"Trainer needs to choose other trainer to send!"
				);
			} else if (sendedPokemon === undefined) {
				return ctx.send("Pokemon not found in the trainer Pokedex");
			} else if (sendedPokemon === null) {
				return ctx.send("Trainer has no Pokemons to send");
			} else {
				ctx.send("Pokemon sended to the other trainer");
			}
		} catch (error) {
			ctx.badRequest(
				"Error sending pokemon to the trainer: " + error.message
			);
		}
	},
};
