const { errors } = require("@strapi/utils");
const { ApplicationError } = errors;

module.exports = {
	async getTrainer(ctx) {
		try {
			const trainerId = ctx.state.user.id
			const trainer = await strapi.entityService.findOne("plugin::users-permissions.user",trainerId,
				{
					populate: ["pokedex"],
				}
			)

			if (!trainer) {
				throw new ApplicationError("Trainer not found!");
			} else {
				return trainer;
			}
		} catch (error) {
			return ctx.badRequest("Error getting trainer: " + error.message);
		}
	},
	async getOtherTrainer(otherTrainerId) {
		let otherTrainer = await strapi.entityService.findOne(
			"plugin::users-permissions.user",
			otherTrainerId,
			{
				populate: ["pokedex"],
			}
		)
		if (!otherTrainer) {
			throw new ApplicationError("Other trainer not found!");
		} else {
			return otherTrainer
		}
	},

	async sendPokemon(trainer, pokemonId, otherTrainerId) {
		let pokemons = await strapi.entityService.findMany(
			"api::pokemon-pokedex.pokemon-pokedex",
			{
				filters: {
					pokedex: trainer.pokedex.id,
				},
				populate: ["pokemon"]
			}
		)

		if (pokemons.length === 0) {
			throw new ApplicationError("Trainer has no Pokemons to send");
		}

		return await this.updatePokemon(pokemonId,pokemons,otherTrainerId)
	},
	async updatePokemon(pokemonId,pokemons,otherTrainerId){
		for (const pokemon of pokemons) {

			if (pokemon.id === pokemonId) {

				let otherTrainer = await this.getOtherTrainer(otherTrainerId)
				let sendedPokemon =await strapi.entityService.update(
					"api::pokemon-pokedex.pokemon-pokedex",
					pokemonId,
					{
						data: {
							pokedex: {
								id: otherTrainer.pokedex.id
							},
							pokemon: {
								id: pokemon.pokemon.id,
								name: pokemon.pokemon.name,
								type1: pokemon.pokemon.type1,
								type2: pokemon.pokemon.type2,
								evolutionLevel: pokemon.pokemon.evolutionLevel
							},
							nickname: pokemon.nickname,
							level: pokemon.level
						},
						populate: ["pokedex","pokemon"]
					}
				)
				return sendedPokemon
				
			}
		}
		throw new ApplicationError("Pokemon not found in the trainer Pokedex")
	}
};
