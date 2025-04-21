'use strict';

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/users',
            handler: 'auth.listUsers',
            config: {
                policies: ['global::isOwner']
            }
        },
        {
            method: 'POST',
            path: '/users',
            handler: 'auth.createUser',
            config: {
                auth: false
            }
        },
        {
            method: 'POST',
            path: '/login',
            handler: 'auth.login',
            config: {
                auth: false
            }
        },
        {
            method: 'GET',
            path: '/me',
            handler: 'auth.me',
            config: {
                policies: ['global::isOwner']
            }
        }
    ]
};