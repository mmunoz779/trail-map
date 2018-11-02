// Configure server constants
const port = 8080;

// Configure express and routing
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');


/* Get a connection to the mySql database */
const mySqlConnection = require('./dbHelpers/mySqlWrapper');

/* The bearerTokenDBHelper handles all of the database operations
relating to saving and retrieving oAuth2 bearer tokens */
const bearerTokensDBHelper =
    require('./dbHelpers/bearerTokensDBHelper')
    (mySqlConnection);

/* The userDBHelper handles all of the database operations relating
to users such as registering and retrieving them */
const userDBHelper = require('./dbHelpers/userDBHelper')
(mySqlConnection);


// Require routing directories
var index = require('../routes/index');
var api = require('../routes/api');
var login = require('../routes/login');
var signup = require('../routes/signup');
var maps = require('../routes/maps');

var app = express();

// Configure project directory pathway
var OSName = "unknown os";
if (process.platform == "win32") OSName = "Windows"; //to build a path to the directory on Windows or Mac/Linux
var directoryArray = __dirname.split(OSName == "Windows" ? '\\' : '/');
var projectDirectory = "";

for (var i = 0; i < directoryArray.length - 1; i++) {
    projectDirectory += directoryArray[i] + (OSName == "Windows" ? '\\' : '/');
}

//View engine
app.set('views', path.join(projectDirectory, OSName != "Windows" ? 'client/views' : 'client\\views')); //sets directory for either windows or mac
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


/* We require the node-oauth2-server library */
const oAuth2Server = require('node-oauth2-server');

/* Here we instantiate the model we just made and inject the dbHelpers we use in it */
const oAuthModel =
    require('./authorization/accessTokenModel')
    (userDBHelper,
        bearerTokensDBHelper);

/* Now we instantiate the oAuth2Server and pass in an object which tells
the the password library that we're using the password  grant type and
give it the model we just required. */
app.oauth = oAuth2Server({
    model: oAuthModel,
    grants: ['password'],
    debug: true
});


/* Here we require the authRoutesMethods object from the module
 that we just made */
const authRoutesMethods =
    require('./authorization/authRoutesMethods')
    (userDBHelper);

/* Now we instantiate the authRouter module and inject all
of its dependencies. */
const authRouter =
    require('./authorization/authRouter')
    (express.Router(),
        app,
        authRoutesMethods);

/* Here we asign the authRouter as middleware in the express app.
 By doing this all request sent to routes that start with /auth
 will be handled by this router*/
app.use('/auth', authRouter);

/* Setup the oAuth error handling */
app.use(app.oauth.errorHandler());


app.use(app.oauth.errorHandler());

// Configure static folder
app.use(express.static(path.join(projectDirectory, 'client')));

// Handle parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Handle routing
app.use('/', index);
app.use('/', api);
app.use('/',login);
app.use('/',maps);
app.use('/',signup);

// Replace with 404 html page in the future with branding
app.use("*", function (req, res) {
    res.status(404).send("Error 404: page not found");
});

// Launch server
var server = app.listen(port, function () {
    console.log("Server is now online on port %s\n", port);
});

module.exports = server;
