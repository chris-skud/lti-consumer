'use strict'

/*
 * Just one big object for now. TODO: Refactor
 */

function LTIConsumer (storage) {
  this.storage = storage
  this.app = this.initApp()
}

LTIConsumer.prototype.launchData = function (launchParameters) {
  console.log(launchParameters)
}

LTIConsumer.prototype.initApp = function () {
  let self = this
  var express = require('express')
  var app = module.exports = express()
  var bodyParser = require('body-parser')
  var multer = require('multer')
  var upload = multer() // for parsing multipart/form-data
  var db = this.storage

  app.use(bodyParser.json()) // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded3

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
      db.providers.get("3", function(err, provider) {
        if (expectsJson(req)) {
          res.json(provider)
        } else {
          res.render('tool_config', provider)
        }
      })
    })
    .post(function (req, res) {
      db.providers.save(req.body, function (err) {
        if (err) {
          console.log(err)
          res.sendStatus(500)
        } else {
          res.sendStatus(201)
        }
      })
    })

  // expectsJson determines if the Content-Type request header is json or other
  // enabling support for view or data rendering through single end point
  function expectsJson (req) {
    var contype = req.headers['content-type']
    return (!!contype && contype.indexOf('application/json') > -1)
  }

  return app
}


module.exports = LTIConsumer
