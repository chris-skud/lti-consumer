'use strict'

function LTIConsumer (app, storage) {
  this.app = app
  this.storage = storage
}

LTIConsumer.prototype.launchData = function (launchParameters) {
  console.log(launchParameters)
}

LTIConsumer.prototype.toolProvider = function (provider_id) {
  return this.storage.providers.get(provider_id)
}

module.exports = LTIConsumer
