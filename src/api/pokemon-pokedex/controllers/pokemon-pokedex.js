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
			)

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
			const pokemon = await strapi.entityService.findOne("api::pokemon.pokemon",pokemonId)
			let pokedex = trainer.pokedex
			if(!pokemon){
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
					populate: ["pokemon","pokedex"]
				}
			)
			console.log(pokemonPokedex)
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
	async gainXp(ctx){
		try{
			let {pokemonId} = ctx.request.body
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
			)
			let trainerPokemons = trainer.pokedex.PokemonPokedex

			for(const pokemon of trainerPokemons){
				if(pokemon.id === parseInt(pokemonId)){
					if(pokemon.level <= 99){
						let updatedPokemon = await strapi.entityService.update('api::pokemon-pokedex.pokemon-pokedex',pokemon.id,{
							data: {
								id: pokemon.id,
								level: pokemon.level + 1,
								nickname: pokemon.nickname,
								pokemon: {
									id: pokemon.pokemon.id,
									name: pokemon.pokemon.name,
									type1: pokemon.pokemon.type1,
									type2: pokemon.pokemon.type2,
									evolutionLevel: pokemon.pokemon.evolutionLevel
								}
							},
							populate: ["pokemon","pokedex"]
						})

						return ctx.send(`${pokemon.nickname || pokemon.pokemon.name} gained 1 level!The pokemon level is: ${updatedPokemon.level}`)
					}
					throw new ApplicationError('Pokemon is at max level!')
				}
			}
			throw new ApplicationError('Pokemon not found!')
		}catch(error){
			ctx.badRequest(error.message)
		}
	},



	async evolvePokemon(ctx){
		try {
			let {pokemonId} = ctx.request.body
			
			let trainer = await helpers.getTrainer(ctx)
			let trainerId = trainer.id
			trainer = await strapi.entityService.findOne(
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
			)
			let pokemonPokedex = trainer.pokedex.PokemonPokedex
			for(const pokemon of pokemonPokedex){
				if(pokemon.id === parseInt(pokemonId)){

					if(pokemon.level >= pokemon.pokemon.evolutionLevel && pokemon.pokemon.evolutionLevel < 99){

						let nextPokemon = await strapi.entityService.findOne('api::pokemon.pokemon',(pokemon.pokemon.id + 2))

						let evolvedPokemon =await strapi.entityService.update('api::pokemon-pokedex.pokemon-pokedex',pokemon.id,{
							data: {
								pokemon: nextPokemon.id
							},
							populate: ["pokemon"]
						})

						return ctx.send(`${pokemon.nickname || pokemon.pokemon.name} evolved to ${nextPokemon.name}`) 
					}
					if(pokemon.pokemon.evolutionLevel === 99){
                        throw new ApplicationError('Pokemon has no more evolutions!')
					}
					throw new ApplicationError('Pokemon has no level to evolve!')
				}
			}
			throw new ApplicationError('Pokemon not found!')
		} catch (error) {
			return ctx.badRequest(error.message)
		}
	}
};
