module.exports = {
    routes : [
        {
            method: 'GET',
            path: '/trainer/pokemons',
            handler: 'pokemon-pokedex.list',
            config: {
                auth: false,
                policies: []
            }
        },
        {
            method: 'POST',
            path: '/trainer/pokemon',
            handler: 'pokemon-pokedex.addPokemon',
            config: {
                auth: false,
                policies: []
            }
        }
    ]
}