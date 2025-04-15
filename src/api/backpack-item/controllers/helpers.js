
module.exports = {
    
    async haveToken(ctx){
        let token = await ctx.request.headers.authorization
        if(!token){
            return false
        }
        token = token.split(' ')[1]
        const decoded = await strapi.plugins['users-permissions'].services.jwt.verify(token)
        return decoded.id
    },
    async verifyBackpack(userId){
        try {
            const user = await strapi.entityService.findOne('plugin::users-permissions.user',userId,{
                populate: {backpack:true},
            })
            return user;
        } catch (error) {
            console.error('Error verifying backpack:', error.message);
            return null;
        }
    },
    async verifyItem(itemId){
        try {
            const foundItem = await strapi.entityService.findOne('api::item.item', parseInt(itemId));
            return foundItem;
        } catch (error) {
            console.error('Error verifying item:', error.message);
            return null;
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
                return false
            }else{
                let newQuantity = backpackItem[0].quantity - parseInt(quantity)
                if(newQuantity <= 0){
                    await strapi.entityService.delete('api::backpack-item.backpack-item',backpackItem[0].id)
                    return undefined
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