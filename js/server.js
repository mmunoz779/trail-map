// Configure server constants
const port = 8080;

// Configure express and routing
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var morgan = require('morgan');
var session = require('express-session');
var db = require('../Models/db.js');

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

// Used for login API endpoint
if (GLOBAL.SQLpool === undefined) {
    GLOBAL.SQLpool = db.createPool(); // create global sql pool connection
}


app.use(session({
    secret: "alphaomega",
    resave: false,
    saveUninitialized: false
}));

morgan.token('res', function getId(res) {
    return res;
});

var accessLogStream = fs.createWriteStream(projectDirectory + '/logs/access.log', {flags: 'a'});

app.use(morgan(':req[body] :res[body]', {stream: accessLogStream}));

// Handle routing
app.use(require('../routes'));

// Launch server
var server = app.listen(port, function () {
    console.log("Server is now online on port %s\n", port);
});

module.exports = server;
