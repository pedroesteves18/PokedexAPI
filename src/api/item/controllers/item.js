"use strict";

module.exports = {
	async populateItems(ctx) {
		try {
			let items = await strapi.entityService.findMany("api::item.item");
			console.log(items);
			if (items.length > 0) {
				return ctx.send({ msg: "Items already populated!" });
			}
			const result = await strapi
				.service("api::item.item")
				.populateItems();
			ctx.send({ msg: result.message });
		} catch (error) {
			ctx.badRequest("Error populating items: " + error.message);
		}
	},
};
