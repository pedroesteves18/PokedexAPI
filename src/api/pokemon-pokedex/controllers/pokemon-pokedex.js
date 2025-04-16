const helper = require('./helpers.js')
module.exports = {
    async list(ctx) {
      try {
        let trainerId = await helper.haveToken(ctx)
        if(!trainerId){
          ctx.badRequest('Trainer needs to be logged in!')
        }
        let trainer = await strapi.entityService.findOne('plugin::users-permissions.user',trainerId,{
            populate: {
                pokedex: {
                    populate: {
                        PokemonPokedex: {
                            populate: ['pokemon']
                        }
                    }
                }
            }
        })
        ctx.send(trainer.pokedex.PokemonPokedex)
      } catch (error) {
        ctx.badRequest('Error listing pokemons in the pokedex' + error.message)
      }
    },
    

    async addPokemon(ctx){
      try{
        let trainerId = await helper.haveToken(ctx)
        if(!trainerId){
          ctx.badRequest('Trainer needs to be logged in!')
        }

        const {pokemonId,level,nickname} = ctx.request.body

        const trainer = await strapi.entityService.findOne('plugin::users-permissions.user',trainerId,{
          populate: {pokedex:true},
      })

        if(!trainer){
          ctx.badRequest('Trainer with pokedex not found!')
        }

        const existingPokemon = await strapi.entityService.findOne('api::pokemon.pokemon', pokemonId)
        if(!existingPokemon){
          ctx.badRequest('Pokemon not found!')
        }
        console.log(trainer)
        console.log(existingPokemon)
        let pokemonPokedex = await strapi.documents('api::pokemon-pokedex.pokemon-pokedex').create({
          data: {
            pokedex: trainer.pokedex.id,
            pokemon: existingPokemon.id,
            level: level,
            nickname: nickname
          }
        })
        ctx.send(pokemonPokedex)
      }catch(error){
        ctx.badRequest(error.message)
      }
    }

  };