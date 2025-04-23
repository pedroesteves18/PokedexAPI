"use strict";

module.exports = {
	routes: [
		{
			method: "GET",
			path: "/items/populate",
			handler: "item.populateItems",
			config: {
				auth: false,
				policies: [],
			},
		},
	],
};
