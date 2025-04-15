
module.exports = {
    async insertItems(items,strapi){
        const createdItems = await Promise.all(
            items.map(item => {
              return strapi.documents('api::item.item').create({ data: item })
            })
        )
        return createdItems
    },
    async createItem(name,strapi){
        try{
            const createdItem = await strapi.documents('api::item.item').create({
                data: {
                    name: name
                }
            })
            return createdItem
        }catch(error){
            throw error
        }
    }
}