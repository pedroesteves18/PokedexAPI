const backpackItensRoutes = require('./backpack-item.js')

module.exports = {
  routes: [...backpackItensRoutes.routes],
}