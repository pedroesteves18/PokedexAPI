"use strict";

/**
 * pokemon-pokedex service
 */

const helpers = require("../controllers/helpers.js");
const { errors, async } = require("@strapi/utils");
const { ApplicationError } = errors;

module.exports = {
	async list(ctx) {
		try {
			let trainerId = ctx.state.user.id;
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

			return trainer.pokedex.PokemonPokedex;
		} catch (error) {
			throw new ApplicationError(
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
			);
			let pokedex = trainer.pokedex;
			if (!pokemon) {
				throw new ApplicationError("Pokemon not found!");
			}

			let pokemonPokedex = await strapi.entityService.create(
				"api::pokemon-pokedex.pokemon-pokedex",
				{
					data: {
						pokedex: pokedex,
						pokemon: pokemon,
						pokemonId: pokemon.id,
						level: level,
						nickname: nickname,
					},
					populate: ["pokemon", "pokedex"],
				}
			);

			return pokemonPokedex;
		} catch (error) {
			throw new ApplicationError(
				"Error adding pokemon to the pokedex: " + error.message
			);
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
			return {
				message: "The pokemon was sent to the other trainer",
			};
		} catch (error) {
			throw new ApplicationError(
				"Error sending pokemon to the trainer: " + error.message
			);
		}
	},
	async gainXp(ctx) {
		try {
			let { pokemonId } = ctx.request.body;
			let trainerId = ctx.state.user.id;
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
			let trainerPokemons = trainer.pokedex.PokemonPokedex;

			for (const pokemon of trainerPokemons) {
				if (pokemon.id === parseInt(pokemonId)) {
					if (pokemon.level <= 99) {
						let updatedPokemon = await this.giveXp(pokemonId);
						console.log(updatedPokemon);
						return {
							message: `${pokemon.nickname || pokemon.pokemon.name} gained 1 level!The pokemon level is: ${updatedPokemon.level}`,
						};
					}
					throw new ApplicationError("Pokemon is at max level!");
				}
			}
			throw new ApplicationError("Pokemon not found!");
		} catch (error) {
			throw new ApplicationError(
				"Error gaining xp to the pokemon: " + error.message
			);
		}
	},
	needStone() {
		return [
			["Growlithe", "Fire stone"],
			["Vulpix", "Fire stone"],
			["Eevee", "Fire stone"],
			["Poliwhirl", "Water stone"],
			["Shellder", "Water stone"],
			["Staryu", "Water stone"],
			["Pikachu", "Thunder stone"],
			["Gloom", "Leaf stone"],
			["Exeggcute", "Leaf stone"],
			["Weepinbell", "Leaf stone"],
			["Nidorino", "Moon stone"],
			["Nidorina", "Moon stone"],
			["Clefairy", "Moon stone"],
			["Jigglypuff", "Moon stone"],
		];
	},
	async giveXp(pokemonId, item) {
		try {
			if (item) {
				let newQuantity = item.quantity - 1;
				if (newQuantity <= 0) {
					await strapi.entityService.delete(
						"api::backpack-item.backpack-item",
						item.id
					);
					return false;
				}
				await strapi.entityService.update(
					"api::backpack-item.backpack-item",
					item.id,
					{
						data: {
							quantity: newQuantity,
						},
					}
				);
				await strapi.entityService.update(
					"api::pokemon-pokedex.pokemon-pokedex",
					pokemonId,
					{
						data: {
							level: 99,
						},
					}
				);
			}

			let pokemon = await strapi.entityService.findOne(
				"api::pokemon-pokedex.pokemon-pokedex",
				pokemonId,
				{
					populate: ["pokemon"],
				}
			);
			console.log(pokemon);
			let updatedPokemon = await strapi
				.documents("api::pokemon-pokedex.pokemon-pokedex")
				.update(pokemon.id, {
					data: {
						nickname: pokemon.nickname,
						level: pokemon.level + 1,
						pokemon: {
							id: pokemon.pokemon.id,
							name: pokemon.pokemon.name,
							type1: pokemon.pokemon.type1,
							type2: pokemon.pokemon.type2,
							evolutionLevel: pokemon.pokemon.evolutionLevel,
						},
					},
					populate: ["pokemon", "pokedex"],
				});
			return updatedPokemon;
		} catch (error) {
			throw new ApplicationError(
				"Error evolving pokemon: " + error.message
			);
		}
	},
	async evolvePokemon(ctx) {
		try {
			let { pokemonId } = ctx.request.body;
			let pokemonsStone = this.needStone();
			let pokemonById = await strapi.entityService.findOne(
				"api::pokemon-pokedex.pokemon-pokedex",
				pokemonId,
				{
					populate: ["pokemon"],
				}
			);
			for (const pokemon of pokemonsStone) {
				if (pokemon[0] === pokemonById.pokemon.name) {
					let user = await strapi.entityService.findOne(
						"plugin::users-permissions.user",
						ctx.state.user.id,
						{
							populate: ["backpack"],
						}
					);
					let items = await strapi.entityService.findMany(
						"api::backpack-item.backpack-item",
						{
							filters: {
								backpack: user.backpack.id,
							},
							populate: ["item"],
						}
					);

					for (const item of items) {
						if (item.item.name === pokemon[1]) {
							let updatedPokemon = await this.giveXp(
								pokemonId,
								item
							);
							let nextPokemon =
								await strapi.entityService.findOne(
									"api::pokemon.pokemon",
									pokemonById.pokemon.id + 2
								);
							updatedPokemon = await strapi.entityService.update(
								"api::pokemon-pokedex.pokemon-pokedex",
								pokemonId,
								{
									data: {
										id: pokemonId,
										nickname: updatedPokemon.nickname,
										level: nextPokemon.level,
										pokemon: {
											id: nextPokemon.id,
											name: nextPokemon.name,
											type1: nextPokemon.type1,
											type2: nextPokemon.type2,
											evolutionLevel:
												nextPokemon.evolutionLevel,
										},
									},
									populate: ["pokemon", "pokedex"],
								}
							);
							return {
								message: `${pokemonById.pokemon.name} needs a ${pokemon[1]} to evolve!You evolved to ${updatedPokemon.pokemon.name}`,
								pokemonId: pokemonById.id,
							};
						}
					}
					return {
						message: `${pokemonById.pokemon.name} needs a ${pokemon[1]} to evolve!You don't have it!`,
						pokemonId: pokemonById.id,
					};
				}
			}
			return {
				message: `${pokemonById.pokemon.name} does not need a stone to evolve!`,
				pokemonId: pokemonById.id,
			};
		} catch (error) {
			throw new ApplicationError(
				"Error evolving pokemon: " + error.message
			);
		}
	},
};
