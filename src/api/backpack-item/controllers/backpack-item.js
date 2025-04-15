'use strict';
const backpack = require('../../backpack/controllers/backpack.js');
const helpers = require('./helpers.js')
module.exports = {
    async takeItem(ctx){
        try{
            // token verification
            let userId = await helpers.haveToken(ctx)
            if(!userId){
                return ctx.badRequest('Token not given!')
            }
            // params verification
            const {quantity,itemId} = ctx.params
            if(!quantity || quantity <=0){
                return ctx.badRequest('Invalid quantity!')
            }
            //item verificaation
            let foundItem = await helpers.verifyItem(itemId)
            if(foundItem === undefined || foundItem === null){
                return ctx.badRequest('Item not found!')
            }
            // user backpack verification
            const user = await helpers.verifyBackpack(userId)
            if (!user || !user.backpack) {
                return ctx.badRequest('backpack not found for user!');
            }
            // verification if item is in the backpack
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
            // token verification
            let userId = await helpers.haveToken(ctx)
            if(!userId){
                return ctx.badRequest('Token not given!')
            }


            // params verification
            const {quantity,itemId} = ctx.params
            if(!quantity || quantity <=0){
                return ctx.badRequest('Invalid quantity!')
            }


            //item verificaation
            let foundItem = await helpers.verifyItem(itemId)
            if(foundItem === undefined || foundItem === null){
                return ctx.badRequest('Item not found!')
            }


            // user backpack verification
            const user = await helpers.verifyBackpack(userId)
            if (!user || !user.backpack) {
                return ctx.badRequest('backpack not found for user!');
            }


            // verification if item is in the backpack
            let backpackId = user.backpack.id
            let res = await helpers.dropBackpackItem(backpackId,foundItem,quantity)
            if(res){
                return ctx.send({
                    message: `${quantity} Item ${foundItem.name} updated to backpack of ${user.username}`,
                })
            } else if(res === false) {
                return ctx.send({
                    message: `Item not found in backpack!`,
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
            let userId = await helpers.haveToken(ctx)
            if(!userId){
                return ctx.badRequest('Token not given!')
            }
            let items = await helpers.getItems(userId)
            console.log(items)
            return ctx.send({items:items})
        }catch(error){
            return ctx.badRequest('Error listing items!')
        }
    }
}