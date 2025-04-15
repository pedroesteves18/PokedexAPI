const helpers = require('./helpers.js')

module.exports = {
    async listUsers(ctx) {
      try {
        const users = await strapi.entityService.findMany('plugin::users-permissions.user')
        ctx.body = {
          data: users
        }
      } catch (error) {
        console.log('Error listing users', error.message)
        ctx.throw(500,'Error listing users', error.message)
      }
    },

    async createUser(ctx){
        try {
          const { email, password, username } = ctx.request.body;
          const data = {email,password,username}

          let emailInUse = await helpers.verifyData(data)    // Retorno na função verifyData diretamente das badRequests não está funcionando

          if(emailInUse === false){
            return ctx.badRequest('Email, username and password are required!');
          } else if(emailInUse === true){
            return ctx.badRequest('Email already in use!');
          } else {
            let newUser = await helpers.createUser(data,ctx)
            ctx.send({ msg: 'User registered!', data: newUser });
          }


        } catch (error) {
          console.error('Unexpected error in createUser:', error);
          return ctx.internalServerError('Unexpected error occurred: ' + error.message);
        }
    },


    async login(ctx) {
        console.log('teste')
        try {
          const { email, password } = ctx.request.body;
          const data = {email,password}
          let user = await helpers.verifyLogin(data)    // Retorno na função verifyLogin diretamente das badRequests não está funcionando

          if(user === false){
            ctx.badRequest('Email and password are required!')
          } else if(user === null){
            ctx.badRequest('Invalid data!')
          } else if(user === undefined){
            ctx.badRequest('Invalid data!')
          } else {
            const token = strapi.plugins['users-permissions'].services.jwt.issue({
              id: user.id,
            })
            ctx.send({
              message: 'Login successful!',
              jwt: token,
              user: {
                id: user.id,
                username: user.username,
                email: user.email
              }
            })
          }
    
        } catch (error) {
          console.error('Login error:', error);
          return ctx.internalServerError('Login failed: ' + error.message);
        }
      },


      async protectedRoute(ctx) {
        try {
          ctx.send({
            message: 'Finalmente!',
            userId: ctx.state.userId,
          });
        } catch (error) {
          return ctx.internalServerError('Error: ' + error.message);
        }
      },
      
      async test(ctx){
        let test = await helpers.haveToken(ctx)
        ctx.send({
          decoded: test
        })
      }
}
  