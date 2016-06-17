var express = require('express')
var app = express()

var lti = require('../../app.js')
app.use(lti)

app.engine('.html', require('ejs').__express)
app.set('views', __dirname + '/views')
app.set('view engine', 'html')

var port = process.env.PORT || 8090
var storage = require('../../lib/storage/jfs.js')(null)

// perhaps something like this
// ltiConsumer.on('grade', function () {
//   console.log('connected to resource server')
// })

// imagine this is the handler for a link presented in the LMS
app.route('/lms')
  .get(function (req, res) {
    var launchParamDefaults = require('../launch_params.js')
    res.render('index', { launchParams: launchParamDefaults })
  })

app.listen(port, function (err) {
  if (err) {
    return console.error('Error starting server: ', err)
  }

  console.log('Server successfully started on port %s', port)
})
