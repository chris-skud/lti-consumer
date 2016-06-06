var morgan = require('morgan')
var bodyParser = require('body-parser')

var declare = function declare (expressApp, options) {
  var app = expressApp || require('express')()

  // these all needs to be options || default
  app.use(morgan('dev'))
  app.set('views', __dirname + '/../views')
  app.set('view engine', 'html')
  app.engine('html', require('ejs').renderFile)
  app.use(require('express').static('static'))
  app.use(require('body-parser').urlencoded({ extended: true }))

  app.route('/config.xml')
    .get(function (req, res) {
      // headers don't seem to get set
      res.sendFile(__dirname + '/../views/config.xml', {'headers': {'Content-Type': 'text/xml'}})
    })
  app.route('/lti')
    .get(function (req, res) {
      res.json('yo')
    })

  app.route('/')
    .get(function (req, res) {
      res.render('index', {'you': 'are'})
    })

  app.route('/tool_config')
    .get(function (req, res) {
      var tool_config = {username: 'it is me'}

      console.log(expectsJson(req))
      if (expectsJson(req)) {
        res.json('tool_config', tool_config)
      } else {
        res.render('tool_config', tool_config)
      }
    })
    .post(bodyParser.urlencoded({ extended: true }), function (req, res) {
      console.log(req.body)
      options.storage.providers.save(req.body, function (err, provider_data) {
        if (err) {
          console.log(err)
        } else {
          console.log(provider_data)
        }
      })
    })
}

function expectsJson (req) {
  var contype = req.headers['content-type']
  return (!contype || contype.indexOf('application/json') !== -1)
}

module.exports.declare = declare
