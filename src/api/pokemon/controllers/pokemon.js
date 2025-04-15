const firstGen = require("./firstGen.js")

module.exports = {
    async list(ctx) {
      try {
        const pokemons = await strapi.entityService.findMany('api::pokemon.pokemon')
        ctx.body = {
          data: pokemons
        }
      } catch (error) {
        console.log('Error listing pokemons', error.message)
        ctx.throw(500,'Error listing pokemons', error.message)
      }
    },

    async populatePokemons(ctx){
      try{
          let insertedPokemons = await strapi.entityService.findMany('api::pokemon.pokemon')
          if(insertedPokemons.length > 0){
            return ctx.send({msg:'Populating was not possible due to pokemons already registered!'})
          }
          await Promise.all(firstGen.map(async (pokemon) => {
                await strapi.entityService.create('api::pokemon.pokemon',{
                  data: {
                    type1: pokemon.type1,
                    type2: pokemon.type2,
                    name: pokemon.name
                  }
                })
          }))
          return ctx.send({msg:"Pokemons were inserted sucessfully!"})
      }catch(error){
        ctx.throw(500,'Error populating pokemons', error.message)
      }
    },


  }