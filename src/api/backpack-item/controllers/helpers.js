
module.exports = {
    async verifyBody(ctx){
        try {
            const {quantity,itemId} = ctx.request.body
            console.log(quantity,itemId)
            if(!quantity || quantity <= 0 || !itemId){
                throw new Error('Invalid body!')
            }
            return {quantity,itemId}
        } catch (error) {
            throw error;
        }
    },
    async verifyBackpack(userId){
        try {
            const user = await strapi.entityService.findOne('plugin::users-permissions.user',userId,{
                populate: {backpack:true},
            })
            if(!user){
                throw new Error('User not found!')
            }
            return user;
        } catch (error) {
            throw error;
        }
    },
    async verifyItem(itemId){
        try {
            const foundItem = await strapi.entityService.findOne('api::item.item', parseInt(itemId));
            if(!foundItem){
                throw new Error('Item not found!')
            }
            return foundItem;
        } catch (error) {
            throw error;
        }
    },
    async verifyItemInBackpack(backpackId,foundItem,quantity){
        try {
            let backpackItem = await strapi.entityService.findMany('api::backpack-item.backpack-item', {
                filters: {
                    backpack: backpackId,
                    item: foundItem.id
                }
            })

            if(backpackItem.length === 0){
                return await this.createBackpackItem(backpackId,foundItem,quantity);
            }else{
                return await this.updateBackpackItem(backpackItem,quantity);
            }
        } catch (error) {
            console.error('Error verifying item in backpack:', error.message);
            throw error;
        }
    },
    async createBackpackItem(backpackId,foundItem,quantity){
        try {
            let itemId = foundItem.id;
            await strapi.entityService.create('api::backpack-item.backpack-item',{
                data:{
                    backpack: backpackId,
                    item: itemId,
                    quantity: parseInt(quantity)
                }
            });
            return false;
        } catch (error) {
            console.error('Error creating backpack item:', error.message);
            throw error;
        }
    },
    async updateBackpackItem(backpackItem,quantity){
        try {
            if(backpackItem[0].quantity + parseInt(quantity) > 99){
                throw new Error('User can not add more items in their backpack! The maximum is 99!')
            }
            const updatedItem = await strapi.entityService.update('api::backpack-item.backpack-item',backpackItem[0].id,{
                data:{
                    quantity: (backpackItem[0].quantity + parseInt(quantity))
                }
            });
            return true;
        } catch (error) {
            console.error('Error updating backpack item:', error.message);
            throw error;
        }
    },
    async dropBackpackItem(backpackId,foundItem,quantity){
        try {
            let backpackItem = await strapi.entityService.findMany('api::backpack-item.backpack-item', {
                filters: {
                    backpack: backpackId,
                    item: foundItem.id
                }
            });

            if(backpackItem.length === 0){
                throw new Error('Item not found in backpack!')
            }else{
                let newQuantity = backpackItem[0].quantity - parseInt(quantity)
                if(newQuantity <= 0){
                    await strapi.entityService.delete('api::backpack-item.backpack-item',backpackItem[0].id)
                    return false
                }
                await strapi.entityService.update('api::backpack-item.backpack-item',backpackItem[0].id,{
                    data:{
                        quantity: (newQuantity)
                    }
                })

                return true
            }
        } catch (error) {
            console.error('Error verifying item in backpack:', error.message);
            throw error;
        }
    },
    async getItems(userId){
        try{
            let backpack = (await this.verifyBackpack(userId)).backpack

            if(!backpack){
                return false
            }
            let items = await strapi.entityService.findMany('api::backpack-item.backpack-item', {
                filters:{
                    backpack: backpack.id
                }
            })
            return items
        }catch(error){
            console.error('Error listing items of backpack:', error.message);
            throw error
        }
    }
}