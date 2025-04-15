'use strict';

module.exports = async (ctx, config, { strapi }) => {
  try {
    const token = ctx.request.headers.authorization;
    
    if (!token) {
      return ctx.unauthorized('Token not provided');
    }
    
    // Remove 'Bearer ' prefix if present
    const tokenValue = token.startsWith('Bearer ') ? token.substring(7) : token;
    
    // Verify the token
    const decoded = await strapi.plugins['users-permissions'].services.jwt.verify(tokenValue);
    
    if (!decoded || !decoded.id) {
      return ctx.unauthorized('Invalid token');
    }
    
    // Find the user
    const user = await strapi.entityService.findOne('plugin::users-permissions.user', decoded.id, {
      populate: ['role']
    });
    
    if (!user) {
      return ctx.unauthorized('User not found');
    }
    
    // Add user to the context state
    ctx.state.user = user;
    ctx.state.userId = user.id;
    
    return true;
  } catch (err) {
    return ctx.unauthorized('Invalid or expired token');
  }
}; 