"use strict";

const errors = require("@strapi/utils").errors;
const { ApplicationError } = errors;
/**
 * pokemon service
 */

module.exports = {
	async populateItems() {
		try {
			const existing =
				await strapi.entityService.findMany("api::item.item");
			if (existing.length > 0) {
				return {
					inserted: false,
					message: "Items already registered!",
				};
			}
			let createdItems = [
				{ name: "Potion" },
				{ name: "Candy" },
				{ name: "Revive" },
				{ name: "Poké ball" },
				{ name: "Great ball" },
				{ name: "Super ball" },
				{ name: "Ultra ball" },
				{ name: "Fire stone" },
				{ name: "Water stone" },
				{ name: "Thunder stone" },
				{ name: "Leaf stone" },
				{ name: "Moon stone" },
			];

			createdItems = await Promise.all(
				createdItems.map(async (item) => {
					return await strapi.entityService.create("api::item.item", {
						data: {
							name: item.name,
						},
					});
				})
			);
			return {
				inserted: true,
				message: "Items created successfully!",
			};
		} catch (error) {
			throw new ApplicationError(
				`populateItems failed: ${error.message}`
			);
		}
	},
};
