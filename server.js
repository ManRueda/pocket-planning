
/**
* MODULE DEPENDENCIES
* -------------------------------------------------------------------------------------------------
* include any modules you will use through out the file
**/

var express = require('express');
var nconf = require('nconf');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Recaptcha = require('recaptcha').Recaptcha;
var methodOverride = require('method-override');
var session = require('express-session');

var app = module.exports = express();
var http = require('http').Server(app);

/**
* CONFIGURATION
* -------------------------------------------------------------------------------------------------
* load configuration settings from ENV, then settings.json.  Contains keys for OAuth logins. See
* settings.example.json.
**/
nconf.env().file({file: 'settings.json'});



/**
* CONFIGURATION
* -------------------------------------------------------------------------------------------------
* set up view engine (jade), css preprocessor (less), and any custom middleware (errorHandler)
**/

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(require('./middleware/locals'));
app.use(cookieParser());
app.use(session({
  secret: 'azure secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
app.use(express.static(__dirname + '/public'));


/**
* ROUTING
* -------------------------------------------------------------------------------------------------
* include a route file for each major area of functionality in the site
**/

require('./routes/home')(app);

/**
* CHAT / SOCKET.IO
* -------------------------------------------------------------------------------------------------
* this shows a basic example of using socket.io to orchestrate chat
**/

// socket.io configuration
var buffer = [];
var io = require('socket.io')(http);

io.set("polling duration", 100);

io.sockets.on('connection', function(socket) {

});

/**
* RUN
* -------------------------------------------------------------------------------------------------
* this starts up the server on the given port
**/

var server = http.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d", server.address().port);
});
