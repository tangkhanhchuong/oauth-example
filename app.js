const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const passport = require('passport')

const session = require('express-session')
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy
const app = express()

app.use(cors({
  credentials: true
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(passport.initialize())
app.set('trust proxy', 1)
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))


passport.serializeUser((user, done) => {
  console.log("Success")
  done(null, user)
})

passport.deserializeUser((user, done) => {
  console.log("Error")
  done(null, user)
})

passport.use(new OAuth2Strategy({
  authorizationURL: 'https://auth.geekup.io/oauth2/auth',
  tokenURL: 'https://auth.geekup.io/oauth2/token',
  clientID: 'OGeekStaging',
  clientSecret: 'ogeek2021',
  callbackURL: 'http://localhost:3000/auth/otable/callback'
},
  function (accessToken, refreshToken, profile, cb) {
    console.log("Hi")
    // User.findOrCreate({ exampleId: profile.id }, function (err, user) {
    //   if (err) cb(err, null)
    //   return cb(null, user);
    // });
    cb(null, { username: "chuong", password: "123456" })
  }
));

app.get('/auth/otable', passport.authenticate('oauth2'));

app.get('/auth/otable/callback', passport.authenticate('oauth2', { failureRedirect: '/auth/otable/failed' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:3000/auth/otable/callback');
  }
);

app.get('/auth/otable/failed', () => {
  res.status(400).json("Authenticate Failed")
});

app.get('/', (req, res) => {
  res.json('welcome')
})

app.listen(3000, () => {
  console.log("Listen at port 3000")
}) 