var routes = require('./routes.js')

var init = function init (app, options) {
  routes.declare(app, options)
}

module.exports.init = init
