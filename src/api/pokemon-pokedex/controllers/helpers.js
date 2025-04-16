
module.exports = {
    async haveToken(ctx){
        let token = await ctx.request.headers.authorization
        if(!token){
            return false
        }
        token = token.split(' ')[1]
        const decoded = await strapi.plugins['users-permissions'].services.jwt.verify(token)
        return decoded.id
    },
}