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

// Configure static folder
app.use(express.static(path.join(projectDirectory, 'client')));

// Handle parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); // body parse the JSON

if (GLOBAL.SQLpool === undefined) {
    GLOBAL.SQLpool = db.createPool(); // create global sql pool connection
}

app.use(session({
    secret: 'alphaomega',
    resave: false,
    saveUninitialized: true
}));

morgan.token('res', function getId(res) {
    return res;
});

var accessLogStream = fs.createWriteStream(projectDirectory + '/logs/access.log', {flags: 'a'});

app.use(morgan(':req[body] :res[body]', {stream: accessLogStream}));

app.use(require('../routes'));

// // Replace with 404 html page in the future with branding
// app.use("*", function (req, res) {
//     res.status(404).send("Error 404: page not found");
// });

// Launch server
var server = app.listen(port, function () {
    console.log("Server is now online on port %s\n", port);
});

//gender, lastLogin, name, role, state

module.exports = server;
