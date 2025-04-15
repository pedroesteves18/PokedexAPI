const backpack = require("../../backpack/controllers/backpack");


module.exports = {
    async verifyData(data){
        if (!data.email || !data.password || !data.username) {
            return false
          }
          let email = data.email
          const usedEmail = await strapi.db.query('plugin::users-permissions.user').findOne({
            where: { email }
          });

          if (usedEmail != null) {
            return true
          }
          return null
    },
    async createUser(data,ctx){
        let {email,password,username} = data

        const newPokedex = await strapi.entityService.create('api::pokedex.pokedex',{
            data: {}
        })  

        const newBackpack = await strapi.entityService.create('api::backpack.backpack',{
            data: {}
        })

        let newUser = await strapi.service('plugin::users-permissions.user').add({
            email,
            password,
            username,
            confirmed: true,
            pokedex: newPokedex.id,
            backpack: newBackpack.id
            ,
            populate:['pokedex','backpack']
        })
        await strapi.entityService.update('api::pokedex.pokedex', newPokedex.id, {
            data: {
                user: newUser.id
            }
        })
    
        await strapi.entityService.update('api::backpack.backpack', newBackpack.id, {
            data: {
                user: newUser.id
            }
        })

        if (!newUser) {
            return ctx.internalServerError('Error while registering User');
        }
        return newUser


    },
    async verifyLogin(data){
        if (!data.email || !data.password) {
            return false
        }
        let email = data.email
        const user = await strapi.query('plugin::users-permissions.user').findOne({
            where:{email}
        })

        if (!user) {
            return null
        }

        const isValidPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(data.password, user.password);

        if (!isValidPassword) {
            return undefined
        }
        return user
    },
    async haveToken(ctx){
        let token = await ctx.request.headers.authorization
        console.log(token)
        if(!token){
            return false
        }
        token = token.split(' ')[1]
        const decoded = await strapi.plugins['users-permissions'].services.jwt.verify(token)
        return decoded.id
    },
}