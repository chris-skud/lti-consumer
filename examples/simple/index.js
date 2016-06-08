var express = require('express')
var app = express()

var port = process.env.PORT || 8090
var storage = require('../../lib/storage/jfs.js')(null)
var LTIConsumer = require('../../lib/lti_consumer.js')

var ltiConsumer = new LTIConsumer(app, storage)

// imagine this is the handler for a link presented in the LMS
app.route('/tool/:id')
  .post(function (req, res) {
    var ldata = ltiConsumer.launchData(require('../launch_params.js'))
  })

app.listen(port, function (err) {
  if (err) {
    return console.error('Error starting server: ', err)
  }

  console.log('Server successfully started on port %s', port)
})
