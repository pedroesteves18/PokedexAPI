'use strict';

const { errors } = require("@strapi/utils");
const { ApplicationError } = errors;

module.exports = {
    async beforeCreate(event){
        try {
            console.log('beforeCreate')
            const {params} = event
            const {quantity,itemId,backpack} = params.data

            if (quantity && quantity > 99) {
                throw new Error(`User can not add ${quantity} in their backpack! The maximum is 99!`);
            }
        } catch (error) {
            console.error('Error beforeCreate:', error.message)
            throw error;
        }
    },
    /*
    async beforeUpdate(event){
        const { data } = event.params
        if(data.quantity < 0){
            return 
        }else if (data.quantity && data.quantity > 99) {
            const {itemId,quantity} = data
            throw new Error(`User can not add more ${quantity} of ${itemId} in their backpack! The maximum is 99 per item!`)
            }
    }
    */
}
