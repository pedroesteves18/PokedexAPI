const { errors } = require("@strapi/utils");
const { ApplicationError } = errors;

module.exports = {
	/*
	async beforeCreate(event) {
		const { data } = event.params;
		if (!data.name) {
			throw new ApplicationError("Item name is required!");
		}

		try {
			const existingItems = await strapi.entityService.findOne(
				"api::item.item",
				{
					filters: {
						name: data.name,
					},
				}
			);
			if (existingItems) {
				throw new ApplicationError("Item already registered!");
			}
		} catch (error) {
			throw error;
		}
	},
    */
};
