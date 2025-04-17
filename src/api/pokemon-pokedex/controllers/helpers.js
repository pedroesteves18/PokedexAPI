const { errors } = require("@strapi/utils");
const { ApplicationError } = errors;

module.exports = {
	async haveToken(ctx) {
		let token = await ctx.request.headers.authorization;
		if (!token) {
			return false;
		}
		token = token.split(" ")[1];
		const decoded =
			await strapi.plugins["users-permissions"].services.jwt.verify(
				token
			);
		return decoded.id;
	},
	async getTrainer(ctx) {
		try {
			const trainerId = await this.haveToken(ctx);
			const trainer = await strapi.entityService.findOne(
				"plugin::users-permissions.user",
				trainerId,
				{
					populate: ["pokedex"],
				}
			);
			if (!trainer) {
				throw new ApplicationError("Trainer not found!");
			} else {
				return trainer;
			}
		} catch (error) {
			return ctx.badRequest("Error getting trainer: " + error.message);
		}
	},
	async deletePokemon(ctx, trainer, pokemonId) {
		try {
			let pokemons = await strapi.entityService.findMany(
				"api::pokemon-pokedex.pokemon-pokedex",
				{
					filters: {
						pokedex: trainer.pokedex.id,
					},
				}
			);
			console.log(pokemons);
			for (const pokemon of pokemons) {
				if (pokemon.id === pokemonId) {
					await strapi.entityService.delete(
						"api::pokemon-pokedex.pokemon-pokedex",
						pokemonId
					);
					return true;
				}
			}
			return null;
		} catch (error) {
			return ctx.badRequest("Error deleting pokemon: " + error.message);
		}
	},
	async getOtherTrainer(otherTrainerId) {
		let otherTrainer = await strapi.entityService.findOne(
			"plugin::users-permissions.user",
			otherTrainerId,
			{
				populate: ["pokedex"],
			}
		);
		if (!otherTrainer) {
			return false;
		} else {
			return otherTrainer;
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
		);

		if (pokemons.length === 0) {
			return false;
		}

		for (const pokemon of pokemons) {
			if (pokemon.id === pokemonId) {
				let otherTrainer = await this.getOtherTrainer(otherTrainerId);
				if (otherTrainer.id != trainer.id) {
					await strapi.entityService.update(
						"api::pokemon-pokedex.pokemon-pokedex",
						pokemonId,
						{
							data: {
								pokedex: otherTrainer.pokedex.id,
								trainerId: trainer.id,
								otherTrainerId: otherTrainer.id,
							},
						}
					);
					return true;
				}
				return false;
			}
			return undefined;
		}
		return null;
	},
};
