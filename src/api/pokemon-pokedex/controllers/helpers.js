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
			}
		)
		console.log(pokemons)

		if (pokemons.length === 0) {
			throw new ApplicationError("Trainer has no Pokemons to send");
		}

		for (const pokemon of pokemons) {
			if (pokemon.id === pokemonId) {
				let otherTrainer = await this.getOtherTrainer(otherTrainerId)

				if (otherTrainer.id != trainer.id) {
					let sendedPokemon =await strapi.entityService.update(
						"api::pokemon-pokedex.pokemon-pokedex",
						pokemonId,
						{
							data: {
								pokedex: otherTrainer.pokedex.id,
								trainerId: trainer.id,
								otherTrainerId: otherTrainer.id,
							},
						}
					)
					
					return sendedPokemon
				}
				throw new ApplicationError("Trainer can not send pokemon to himself!");
			}
			throw new ApplicationError("Pokemon not found in the trainer Pokedex");
		}
		throw new ApplicationError("Pokemon not found in the trainer Pokedex");
	},
	async evolvePokemon(pokemonId,trainer){
		try {
			let pokemons = await strapi.entityService.findMany("api::pokemon-pokedex.pokemon-pokedex", {
				populate: ["pokemon","pokedex"],
			  })
			for(const pokemon of pokemons){
				if(pokemon.id === parseInt(pokemonId)){
					console.log(pokemon)
				}
			}
		} catch (error) {
			throw error;
		}
	}
};
