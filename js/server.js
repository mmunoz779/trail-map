// Configure server constants
const port = 8080;

// Configure express and routing
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

// Require routing directories
var index = require('../routes/index');
var api = require('../routes/api');

var app = express();

// Configure project directory pathway
var directoryArray = __dirname.split('\\');
var projectDirectory = "";

for (var i = 0; i < directoryArray.length - 1; i++) {
    projectDirectory += directoryArray[i] + '\\';
}

//View engine
app.set('views', path.join(projectDirectory, 'client\\views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Configure static folder
app.use(express.static(path.join(projectDirectory, 'client')));

// Handle parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Handle routing
app.use('/', index);
app.use('/api', api);

// Replace with 404 html page in the future with branding
app.use("*", function (req, res) {
    res.status(404).send("Error 404: page not found");
});

// Launch server
var server = app.listen(port, function () {
    console.log("Server is now online on port " + port);
});

module.exports = server;