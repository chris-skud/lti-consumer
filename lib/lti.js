var routes = require('./routes.js')

var init = function init(app, options) {
  if (options.consumer) {
    routes.declare()
  }
}

module.exports.init = init