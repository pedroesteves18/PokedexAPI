const backpack = require("../../backpack/controllers/backpack");


module.exports = {
    async verifyData(data){
        if (!data.email || !data.password || !data.username) {
            throw new Error('Email, username and password are required!');
        }
        let email = data.email
        const usedEmail = await strapi.db.query('plugin::users-permissions.user').findOne({
            where: { email }
        });

        if (usedEmail != null) {
            throw new Error('Email already in use!');
        }
        return true;
    },
    async createBackpackPokedex(){
        let newPokedex = await strapi.entityService.create('api::pokedex.pokedex',{
            data: {}
        })  


        let newBackpack = await strapi.entityService.create('api::backpack.backpack', {
            data: {}
        });
        return {newPokedex,newBackpack}
    },
    async createUser(data, ctx){
        try {
            let {email, password, username} = data

            let {newPokedex,newBackpack} = await this.createBackpackPokedex()


            let newUser = await strapi.plugins['users-permissions'].services.user.add({
                email,
                username,
                password,
                provider: 'local',
                confirmed: true,
                blocked: false,
                role: 1
            })

            if (!newUser) {
                throw new Error('Failed to create user');
            }

            newUser = await strapi.plugins['users-permissions'].services.user.edit(newUser.id, {
                pokedex: newPokedex.id,
                backpack: newBackpack.id
            })
            
            newPokedex = await strapi.entityService.update('api::pokedex.pokedex', newPokedex.id, {
                data: {
                    user: newUser.id
                }
            })

            newBackpack = await strapi.entityService.update('api::backpack.backpack', newBackpack.id, {
                data: {
                    user: newUser.id
                }
            })


            return newUser;
        } catch (error) {
            console.error('Error in createUser:', error);
            throw error;
        }
    },
    async verifyLogin(data){
        if (!data.email || !data.password) {
            throw new Error('Email and password are required!');
        }
        let email = data.email
        const user = await strapi.query('plugin::users-permissions.user').findOne({
            where:{email}
        })

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isValidPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(data.password, user.password);

        const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
            id: user.id
        });

        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }
        return {user,jwt}
    }
}