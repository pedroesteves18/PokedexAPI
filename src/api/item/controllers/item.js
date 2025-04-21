'use strict';
const helpers = require('./helpers.js')
module.exports = {
    async populateItems(ctx) {

      const items = [
        { name: 'Potion' },
        { name: 'Candy' },
        { name: 'Revive' },
        { name: 'Poké ball' },
        { name: 'Great ball' },
        { name: 'Super ball' },
        { name: 'Ultra ball' },
        { name: 'Fire stone' },
        { name: 'Water stone' },
        { name: 'Thunder stone' },
        { name: 'Leaf stone' },
        { name: 'Moon stone' }
        
      ];
  
      try {
        let createdItems = await helpers.insertItems(items,strapi)
        ctx.send({ msg: 'Items inserted!', items: createdItems })
      } catch (error) {
        return ctx.badRequest('Error populating items!' + error.message);
      }
    },
    async createItem(ctx){

      try{

        const {name} = ctx.request.body

        let newItem = await helpers.createItem(name,strapi)
        ctx.send({msg:'Item registered!', data: newItem})
      }catch(error){
        return ctx.badRequest('Error creating item! ' + error.message)
      }
    }
  }