"use strict";

const backpackItemService = require("../services/backpack-item.js");

module.exports = {
	async addItem(ctx) {
		return backpackItemService.addItem(ctx);
	},
	async dropItem(ctx) {
		return backpackItemService.dropItem(ctx);
	},
	async getUserItems(ctx) {
		return backpackItemService.getUserItems(ctx);
	},
};
