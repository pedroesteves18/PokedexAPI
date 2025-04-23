module.exports = {
	routes: [
		{
			method: "GET",
			path: "/trainer/pokemons",
			handler: "pokemon-pokedex.list",
			config: {
				policies: ["global::isOwner"],
			},
		},
		{
			method: "POST",
			path: "/trainer/pokemon",
			handler: "pokemon-pokedex.addPokemon",
			config: {
				policies: ["global::isOwner"],
			},
		},
		{
			method: "PUT",
			path: "/trainer/pokemon/send",
			handler: "pokemon-pokedex.sendPokemon",
			config: {
				policies: ["global::isOwner"],
			},
		},
		{
			method: "POST",
			path: "/trainer/pokemon/gainXp",
			handler: "pokemon-pokedex.gainXp",
			config: {
				policies: ["global::isOwner"],
			},
		},
		{
			method: "POST",
			path: "/trainer/pokemon/evolve",
			handler: "pokemon-pokedex.evolvePokemon",
			config: {
				policies: ["global::isOwner"],
			},
		},
	],
};
