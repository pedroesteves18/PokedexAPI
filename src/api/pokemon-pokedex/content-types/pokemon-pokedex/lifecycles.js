const { errors } = require("@strapi/utils");
const { ApplicationError } = errors;

module.exports = {
	async beforeCreate(event) {
		let { data } = event.params;
		if (!data.pokemonId) {
			throw new ApplicationError("Pokemon ID is needed!");
		}
		if (!data.level) {
			throw new ApplicationError("The Pokemon level is needed!");
		}
		if (data.level < 1 || data.level > 100) {
			throw new ApplicationError(
				"The Pokemon level must be between 1 and 100!"
			);
		}
		try {
			const pokemon = await strapi.entityService.findOne(
				"api::pokemon.pokemon",
				data.pokemonId
			)
			if (!pokemon) {
				throw new ApplicationError("Pokemon not found!");
			}
		} catch (error) {
			throw error;
		}
	},
	async beforeUpdate(event) {
		const { data, where } = event.params;

		if (data.pokedex && data.trainerId && data.otherTrainerId) {
			const pokemon = await strapi.entityService.findOne(
				"api::pokemon-pokedex.pokemon-pokedex",
				where.id,
				{
					populate: ["pokedex"],
				}
			)
			console.log(pokemon)
			if(!pokemon){
				throw new ApplicationError("Pokemon not found!");
			}

			const currentTrainer = await strapi.entityService.findOne(
				"plugin::users-permissions.user",
				data.trainerId,
				{
					populate: ["pokedex"],
				}
			)

			if (currentTrainer.id !== data.trainerId) {
				throw new ApplicationError("You are not the owner of this Pokemon!");
			}
		}
	},
};
