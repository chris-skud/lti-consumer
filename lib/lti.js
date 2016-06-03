var routes = require('./routes.js')

var init = function init(app, options) {
  console.log('hgere')
  routes.declare(app, options)
}

module.exports.init = init