const helpers = require("./helpers.js");
const { errors } = require("@strapi/utils");
const { ApplicationError } = errors;

module.exports = {
	async list(ctx) {
		try {
			let trainerId = ctx.state.user.id
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
			const pokemon = await strapi.entityService.findOne(
				"api::pokemon.pokemon",
				pokemonId
			)
			let pokedex = trainer.pokedex
			if(!pokemon){
				throw new ApplicationError("Pokemon not found!");
			}

			let pokemonPokedex = await strapi.entityService.create(
				"api::pokemon-pokedex.pokemon-pokedex",
				{
					data: {
						pokedex: pokedex.id,
						pokemon: pokemon.id,
						pokemonId: pokemon.id,
						level: level,
						nickname: nickname,
					},
					populate: ["pokemon","pokedex"]
				}
			)
			ctx.send(pokemonPokedex);
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

			return ctx.send('Pokemon sended to the other trainer: ' + sendedPokemon)
		} catch (error) {
			ctx.badRequest(
				"Error sending pokemon to the trainer: " + error.message
			);
		}
	},
	async evolvePokemon(ctx){
		try {
			let {pokemonId} = ctx.request.body
			let trainer = await helpers.getTrainer(ctx)
			let evolvedPokemon = await helpers.evolvePokemon(pokemonId,trainer)
			return ctx.send('Pokemon evolved',evolvedPokemon)
		} catch (error) {
			ctx.badRequest(error.message)
		}
	}
};
