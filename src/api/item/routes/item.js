'use strict';

module.exports = {
    routes :[
        {
            method: 'GET',
            path: '/items/populate',
            handler: 'item.populateItems',
            config: {
                auth: false,
                policies: [],
            },
        },
        {
            method: 'POST',
            path: '/items',
            handler: 'item.createItem',
            config: {
                auth: false,
                policies: []
            }
        }
    ]
}