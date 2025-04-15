'use strict';

module.exports = {
    routes : [
        {
            method: 'POST',
            path: '/backpack/:quantity/:itemId',
            handler: 'backpack-item.takeItem',
            config: {
                auth: false
            }
        },
        {
            method: 'DELETE',
            path: '/backpack/:quantity/:itemId',
            handler: 'backpack-item.dropItem',
            config: {
                auth: false
            }
        },
        {
            method: 'GET',
            path:'/backpack/items',
            handler: 'backpack-item.getUserItems',
            config: {
                auth: false
            }
        }
    ]
}