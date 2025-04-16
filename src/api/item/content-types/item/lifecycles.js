const { errors } = require('@strapi/utils');
const { ApplicationError } = errors;

module.exports = {
    async beforeCreate(event) {
            const {data} = event.params
            if (!data.name) {
                throw new ApplicationError('Item name is required!')
            }
            
            try {
                const existingItems = await strapi.documents('api::item.item').findMany({
                    filters: {
                        name: {
                            $eqi:data.name
                        }
                    }
                })

                
                if (existingItems.length > 0) {
                    throw new ApplicationError('Item already registered!')
                }

            } catch (error) {
                throw error
            }
        }
}