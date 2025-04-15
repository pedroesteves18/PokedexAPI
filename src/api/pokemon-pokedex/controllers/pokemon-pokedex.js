module.exports = {
    async list(ctx) {
      try {
        let {id} = ctx.params
        let trainer = await strapi.entityService.findOne('api::trainer.trainer',id,{
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
        let pokemons = trainer.pokedex.pokedexPokemons
        console.log(trainer)
        ctx.send(pokemons)
      } catch (error) {
        console.log('Error listing pokemons in the pokedex', error.message)
        ctx.throw(500,'Error listing pokemons in the pokedex', error.message)
      }
    },
    
    async addPokemon(ctx){
      try{



      }catch(error){
        console.log('Error creating a Pokemon,' + error.message)
        ctx.throw(500,'Error creating a Pokemon' + error.message)
      }
    }

  };