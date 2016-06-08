var express = require('express')
var app = express()

var port = process.env.PORT || 8090
var LTIConsumer = require('../../lib/lti_consumer.js')
var storage = require('../../lib/storage/jfs.js')(null)

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy(
  function (username, password, done) {
    storage.providers.get(username, function (err, user) {
      console.log(err)
      if (err) { return done(err) }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' })
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' })
      }
      return done(null, {user_name: 'buddy'})
    })
  }
))

var ltiConsumer = new LTIConsumer(app, storage)

app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(function (user, done) {
  done(null, user.username)
})

passport.deserializeUser(function (username, done) {
  storage.providers.get(username, function (err, user) {
    done(err, user)
  })
})

app.use('views', express.static(__dirname + '/views'))
app.route('/login')
  .get(function (req, res) {
    res.sendFile(__dirname + '/views/login.html')
  })
  .post(passport.authenticate('local'), function (req, res) {
    res.json('auth successful')
  })
app.listen(port, function (err) {
  if (err) {
    return console.error('Error starting server: ', err)
  }

  console.log('Server successfully started on port %s', port)
})

// you can also delegate creation of express web server to lti-consumer module
// ltiConsumer.init(null, {})
