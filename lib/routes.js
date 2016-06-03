var morgan = require('morgan')
var bodyParser = require('body-parser')

var declare = function declare(expressApp, options) {
  var app = expressApp || require('express')()

  // these all needs to be options || default
  app.use(morgan('dev'))
  app.set('views', __dirname + '/../views')
  app.set('view engine', 'html')
  app.engine('html',require('ejs').renderFile)
  app.use(require('express').static('static'))

  app.route('/config.xml')
    .get(function(req, res) {
      // headers don't seem to get set
      res.sendFile(__dirname + '/../views/config.xml', {'headers': {'Content-Type': 'text/xml'}})
    })
  app.route('/lti')
    .get(function (req, res) {
      res.json('yo')
    })

  // todo: session
  var user = "me"
  app.route('/')
    .get(function (req, res) {
      res.render('index', {'you': 'are'})
    })

    app.route('/login')
    .post(function (req, res) {
      res.render('index', {'you': 'are'})
    })

  app.route('/tool_config')
    .get(function (req, res) {
      res.render('tool_config', {'username': user})
    })
    .post(bodyParser.urlencoded({ extended: true }), function (req, res) {
      console.log(req.body)
    })
}

module.exports.declare = declare

