// Configure server constants
const port = 8080;

// Configure express and routing
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
login = require('../models/users/login');
logout = require('../models/users/logout');
signup = require('../models/users/signup');

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

// Configure static folder
app.use(express.static(path.join(projectDirectory, 'client')));

// Handle parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); // body parse the JSON


app.use(session({
    secret: "alphaomega",
    resave: false,
    saveUninitialized: false
}));

// Handle routing
app.use(require('../routes'));

// Launch server
var server = app.listen(port, function () {
    console.log("Server is now online on port %s\n", port);
});

server.on('close', function () {
    signup.closeConnections();
    login.closeConnections();
    console.log("Server closing...\n");
});

module.exports = server;
