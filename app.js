var express = require('express')
var app = module.exports = express()
var bodyParser = require('body-parser')
var multer = require('multer')
var upload = multer() // for parsing multipart/form-data

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.route('/config.xml')
  .get(function (req, res) {
    res.sendFile(__dirname + '/views/config.xml', {'headers': {'Content-Type': 'text/xml'}})
  })

app.route('/launch')
  .get(function (req, res) {
    // res.render('redirect', {'launchData': {'key': 'value'}})
    res.json(req.body)
  })
  .post(upload.array(), function (req, res) {
    res.render(__dirname + '/views/redirect.html', {'launchData': JSON.parse(req.body.launchData)})
  })

app.route('/tool_config')
  .get(function (req, res) {
    var tool_config = {username: 'it is me'}

    if (expectsJson(req)) {
      res.status(200).json(tool_config)
    } else {
      res.render('tool_config', tool_config)
    }
  })
  .post(function (req, res) {
    console.log(req.body)
    // storage.providers.save(req.body, function (err, provider_data) {
    //   if (err) {
    //     console.log(err)
    //   } else {
    //     console.log(provider_data)
    //   }
    // })
  })

function expectsJson (req) {
  var contype = req.headers['content-type']
  return (!!contype && contype.indexOf('application/json') > -1)
}
