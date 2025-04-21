'use strict';

module.exports = {
    routes : [
        {
            method: 'POST',
            path: '/backpack/addItem',
            handler: 'backpack-item.addItem',
            config: {
                policies: ['global::isOwner']
            }

        },
        {
            method: 'PUT',
            path: '/backpack/dropItem',
            handler: 'backpack-item.dropItem',
            config: {
                policies: ['global::isOwner']
            }

        },
        {
            method: 'GET',
            path:'/backpack/getItems',
            handler: 'backpack-item.getUserItems',
            config: {
                policies: ['global::isOwner']
            }

        }
    ]
}