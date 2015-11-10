
/**
* MODULE DEPENDENCIES
* -------------------------------------------------------------------------------------------------
* include any modules you will use through out the file
**/

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Recaptcha = require('recaptcha').Recaptcha;
var methodOverride = require('method-override');
var cookieSession = require('cookie-session');
var uuid = require('node-uuid');
var cookie = require('cookie');
var planning = require('./middleware/planning');

var app = module.exports = express();
var http = require('http').Server(app);

/**
* CONFIGURATION
* -------------------------------------------------------------------------------------------------
* set up view engine (jade), css preprocessor (less), and any custom middleware (errorHandler)
**/
var sessionHandler = cookieSession({
  name: 'session',
  secret: 'my super cookie secret'
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(require('./middleware/locals'));
app.use(cookieParser());
app.use(sessionHandler);
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next){
  res.locals = res.locals || {};
  req.session.uuid = req.session.uuid || uuid.v4();
  res.locals.sessionId = req.session.uuid;
  next();
});
/**
* ROUTING
* -------------------------------------------------------------------------------------------------
* include a route file for each major area of functionality in the site
**/

require('./routes/home')(app);
require('./routes/planning')(app);

/**
* CHAT / SOCKET.IO
* -------------------------------------------------------------------------------------------------
* this shows a basic example of using socket.io to orchestrate chat
**/

// socket.io configuration
var buffer = [];
var io = require('socket.io')(http);

io.set("polling duration", 100);
io.use(function(socket, next){
  sessionHandler(socket.request, socket.request.res, next);
});
io.on('connection', function(socket) {

  socket.on('send', function(data){
    console.log(data);
  });

  socket.on('addUser', function(opts){
    planning.addUser(opts.session, socket.request.session, socket);
  });

  socket.on('addStory', function(story){
    planning.addStory(story.session, story);
    planning.broadcastStory(story.session, story.uuid);
  });

  socket.on('delStory', function(uuids){
    planning.removeStory(uuids.sesUuid, uuids.stoUuid);
    planning.broadcastDelStory(uuids.sesUuid, uuids.stoUuid);
  });

});

/**
* RUN
* -------------------------------------------------------------------------------------------------
* this starts up the server on the given port
**/

var server = http.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d", server.address().port);
});
