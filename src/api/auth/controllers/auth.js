'use strict';
const helpers = require('./helpers.js')
module.exports = {
	async listUsers(ctx) {
		try {
			const { user } = ctx.state;
			
			if (!user) {
				return ctx.unauthorized();
			}

			const users = await strapi.entityService.findMany('plugin::users-permissions.user')
			return {
				data: users
			};
		} catch (error) {
			return ctx.badRequest('Error listing users', { error: error.message });
		}
	},

	async createUser(ctx) {
		try {
			const { email, password, username } = ctx.request.body;
			await helpers.verifyData({ email, password, username})


			let newUser = await helpers.createUser({email,password,username},ctx)			
			console.log(newUser)
			return {
				msg: 'User registered!',
				data: {
					id: newUser.id,
					username: newUser.username,
					email: newUser.email
				}
			};
		} catch (error) {
			return ctx.badRequest('Error creating user', { error: error.message });
		}
	},

	async login(ctx) {
		try {
			const { email, password } = ctx.request.body;

			let {user,jwt} = await helpers.verifyLogin({email,password})

			return {
				message: 'Login successful!',
				jwt,
				user: {
					id: user.id,
					username: user.username,
					email: user.email
				}
			};
		} catch (error) {
			return ctx.badRequest('Login failed', { error: error.message });
		}
	},

	async me(ctx) {
		try {
			const { user } = ctx.state;
			if (!user) {
				return ctx.unauthorized('You must be logged in to access this route');
			}
			
			let userFound = await strapi.entityService.findOne('plugin::users-permissions.user', user.id)

			if (!userFound) {
				return ctx.forbidden('User role not found');
			}

			return {
				message: 'Protected route accessed successfully!',
				user: {
					id: userFound.id,
					username: userFound.username,
					email: userFound.email
				}
			};
		} catch (error) {
			return ctx.badRequest('Error accessing protected route', { error: error.message });
		}
	}
};
