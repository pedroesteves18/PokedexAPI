const { errors } = require("@strapi/utils");
const { ApplicationError } = errors;

module.exports = {
	async afterUpdate(event) {
		const { data, where } = event.params;
		
		if (event.state.oldPokemon.level < data.level) {

			let pokemonEvolving = await strapi.entityService.findOne("api::pokemon-pokedex.pokemon-pokedex",
				data.id,
				{ populate: { pokemon: true } }
			);

			if (pokemonEvolving.level >= pokemonEvolving.pokemon.evolutionLevel &&pokemonEvolving.pokemon.evolutionLevel < 99) {
				let nextId = pokemonEvolving.pokemon.id + 2;
				let nextPokemon = await strapi.entityService.findOne(
					"api::pokemon.pokemon",
					nextId
				);

				let evolvedPokemon = await strapi.entityService.update("api::pokemon-pokedex.pokemon-pokedex",
						data.id,
						{
						data: {
							id: pokemonEvolving.id,
							nickname: pokemonEvolving.nickname,
							level: pokemonEvolving.level,
							pokemon: nextPokemon.id
						},
						populate: { pokemon: true },
					});

				return
			}
		}

		let oldUser = event.state.originalUser;
		let oldUserPokedex = await strapi.entityService.findOne(
			"plugin::users-permissions.user",
			oldUser.id,
			{
				populate: ["pokedex"],
			}
		);

		if (
			data.pokedex &&
			oldUser &&
			data.pokedex.set[0].id !== oldUserPokedex.pokedex.id
		) {
			console.log("ok");
			const oldPokemon = await strapi.entityService.findOne(
				"api::pokemon-pokedex.pokemon-pokedex",
				where.id,
				{
					populate: ["pokemon", "pokedex"],
				}
			);

			const newTrainer = await strapi.entityService.findOne(
				"api::pokedex.pokedex",
				data.pokedex.set[0].id,
				{
					populate: ["user"],
				}
			);

			console.log(
				`Pokemon ${oldPokemon.pokemon.name} transferred from ${oldUser.username} to ${newTrainer.user.username} at ${new Date()}`
			);
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
			);
			if (!pokemon) {
				throw new ApplicationError("Pokemon not found!");
			}
		} catch (error) {
			throw error;
		}
	},
	async beforeUpdate(event) {
		const { data, where } = event.params;

		let oldPokemonPokedex = await strapi.entityService.findOne(
			"api::pokemon-pokedex.pokemon-pokedex",
			where.id,
			{
				populate: {
					pokedex: {
						populate: ["user"],
					},
				},
			}
		);

		event.state.oldPokemon = oldPokemonPokedex;
		event.state.originalUser = oldPokemonPokedex.pokedex.user;
		if (!data.pokedex) {
			return;
		}
		console.log('Data:' ,data);
		let newUser = await strapi.entityService.findOne(
			"api::pokedex.pokedex",
			data.pokedex.set[0].id,
			{
				populate: ["user"],
			}
		);

		if (oldPokemonPokedex.pokedex.user.id !== newUser.user.id) {
			const pokemon = await strapi.entityService.findOne(
				"api::pokemon-pokedex.pokemon-pokedex",
				where.id,
				{
					populate: ["pokedex"],
				}
			);
			if (!pokemon) {
				throw new ApplicationError("Pokemon not found!");
			}
			if (pokemon.pokedex.id !== oldPokemonPokedex.pokedex.id) {
				throw new ApplicationError(
					"You are not the owner of this Pokemon!"
				);
			}
		} else {
			throw new ApplicationError(
				"You can not transfer a pokemon to yourself!"
			);
		}
	},
};
