var express = require('express')
var app = express()

var port = process.env.PORT || 8090
var ltiConsumer = require('../lib/lti.js')
var storage = require('../lib/storage/jfs.js')(null)
var options = {port: port, storage: storage}

ltiConsumer.init(app, options)

app.listen(port, function (err) {
  if (err) {
    return console.error('Error starting server: ', err)
  }

  console.log('Server successfully started on port %s', port)
})

// you can also delegate creation of express web server to lti-consumer module
// ltiConsumer.init(null, {})
