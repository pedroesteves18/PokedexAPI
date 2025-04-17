module.exports = {
	routes: [
		{
			method: "GET",
			path: "/trainer/pokemons",
			handler: "pokemon-pokedex.list",
			config: {
				auth: false,
				policies: [],
			},
		},
		{
			method: "POST",
			path: "/trainer/pokemon",
			handler: "pokemon-pokedex.addPokemon",
			config: {
				auth: false,
				policies: [],
			},
		},
		{
			method: "PUT",
			path: "/trainer/pokemon",
			handler: "pokemon-pokedex.removePokemon",
			config: {
				auth: false,
				policies: [],
			},
		},
		{
			method: "PUT",
			path: "/trainer/pokemon/send",
			handler: "pokemon-pokedex.sendPokemon",
			config: {
				auth: false,
				policies: [],
			},
		},
	],
};
