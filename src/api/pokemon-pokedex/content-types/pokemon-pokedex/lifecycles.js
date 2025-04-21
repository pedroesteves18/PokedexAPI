const { errors } = require("@strapi/utils");
const { ApplicationError } = errors;

module.exports = {
	async afterUpdate(event){
		const {data,where} = event.params
		console.log(data)
		if(data.level >= data.pokemon.set[0].evolutionLevel && data.pokemon.set[0].evolutionLevel < 99){
			let nextId = data.pokemon.set[0].id + 2
			let nextPokemon = await strapi.entityService.findOne('api::pokemon.pokemon',nextId)

			let evolvedPokemon =await strapi.entityService.update('api::pokemon-pokedex.pokemon-pokedex',data.id,{
				data: {
					id: data.id,
					nickname: data.nickname,
					level: data.level,
					pokemon: {
						id: nextPokemon.id,
						name: nextPokemon.name,
						type1: nextPokemon.type1,
						type2: nextPokemon.type2,
						evolutionLevel: nextPokemon.evolutionLevel
					}
				},
				populate: ["pokemon"]
			})

			return evolvedPokemon
		}

	},
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
		if(data.level){

		}


		if (data.pokedex && data.trainerId) {
			const pokemon = await strapi.entityService.findOne(
				"api::pokemon-pokedex.pokemon-pokedex",
				where.id,
				{
					populate: ["pokedex"],
				}
			)

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
