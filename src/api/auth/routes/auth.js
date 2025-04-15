module.exports = {
    routes : [
        {
            method: 'GET',
            path: '/users',
            handler: 'auth.listUsers',
            config: {
                auth: false
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
            method: 'POST',
            path: '/protected',
            handler: 'auth.protectedRoute',
            config: {
              policies: ['global::jwtPolicy']
            }
          },
          {
            method: 'POST',
            path: '/test',
            handler: 'auth.test',
            config: {
              auth: false
            }
          }
    ]
}