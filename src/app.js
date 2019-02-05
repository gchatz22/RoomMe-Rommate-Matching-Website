const http = require('http');
const express = require('express');
const views = require('./routes/views');
const api = require('./routes/api');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const session = require('express-session');
const db = require('./db');
const passport = require('./passport');

const app = express()

// set POST request body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'session-secret',
    resave: 'false',
    saveUninitialized: 'true'
  }));
  
// hook up passport
app.use(passport.initialize());
app.use(passport.session());

// authentication routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate(
    'google',
    { failureRedirect: '/login' }
  ),
  function(req, res) {
    res.redirect('/feed');
  }
);


app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// Connections
app.use('/', views);
app.use('/static', express.static('public'));
app.use('/api', api);
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');




// 404 route
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
// route error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        status: err.status,
        message: err.message,
    });
});

const PORT = process.env.PORT || 3000;
server = http.Server(app);
server.listen(PORT,function() {
    console.log('server listening on port ' + PORT);
})
