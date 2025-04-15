module.exports = {
    routes : [
        {
            method: 'GET',
            path: '/trainer/:id/pokemons',
            handler: 'pokemon-pokedex.list',
            config: {
                auth: false
            }
        }
    ]
}