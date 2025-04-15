module.exports = {
    routes : [
        {
            method: 'GET',
            path: '/pokemon',
            handler: 'pokemon.list',
            config: {
                auth: false
            }
        },
        {
            method: 'GET',
            path: '/pokemon/populate',
            handler: 'pokemon.populatePokemons',
            config: {
                auth: false
            }
        }

    ]
}