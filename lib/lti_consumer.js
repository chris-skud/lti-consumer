'use strict'

var routes = require('./routes.js')

function LTIConsumer (app, storage) {
  this.app = app
  this.storage = storage

  routes.declare(app, storage)
}

LTIConsumer.prototype.launchData = function (launchParameters) {
  console.log(launchParameters)
}

module.exports = LTIConsumer
