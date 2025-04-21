'use strict';
const backpack = require('../../backpack/controllers/backpack.js');
const helpers = require('./helpers.js')
module.exports = {
    async addItem(ctx){
        try{

            let {quantity,itemId} = await helpers.verifyBody(ctx)
            let foundItem = await helpers.verifyItem(itemId)
            
            let userId = ctx.state.user.id
            const user = await helpers.verifyBackpack(userId)
            let backpackId = user.backpack.id

            let res = await helpers.verifyItemInBackpack(backpackId,foundItem,quantity)
            if(res){
                return ctx.send({
                    message: `${quantity} Item ${foundItem.name} updated to backpack of ${user.username}`,
                })
            } else {
                return ctx.send({
                    message: `${quantity} Item ${foundItem.name} to backpack of ${user.username}`,
                })
            }
        }catch(error){
            console.error('Error in takeItem:', error);
            return ctx.badRequest(`Error adding item: ${error.message}`);
        }
    },
    async dropItem(ctx){
        try{

            const {quantity,itemId} = await helpers.verifyBody(ctx)

            let foundItem = await helpers.verifyItem(itemId)

            let userId = ctx.state.user.id
            const user = await helpers.verifyBackpack(userId)
            let backpackId = user.backpack.id

            let res = await helpers.dropBackpackItem(backpackId,foundItem,quantity)
            if(res){
                return ctx.send({
                    message: `${quantity} Item ${foundItem.name} updated to backpack of ${user.username}`,
                })
            } else{
                return ctx.send({msg:'Item was removed from backpack!'})
            }
        }catch(error){
            return ctx.badRequest(`Error removing item: ${error.message}`);
        }
    },
    async getUserItems(ctx){
        try{
            let userId = ctx.state.user.id
            let items = await helpers.getItems(userId)
            return ctx.send({items:items})
        }catch(error){
            return ctx.badRequest('Error listing items!')
        }
    }
}