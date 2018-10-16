var http = require('http');
var connect = require('connect');
var express = require('express');

var fs = require('fs');

var app = express();
console.log("Server is now online.\n");

app.use(express.static('~/Documents/CollegeStuff/CS3141/trailmap/html'));

// Route for everything else.
app.get('*', function(request, response){
    response.send('Error 404: Not found');
});

app.get("/home", function (request, response) {
    response.writeHead(goodStatus);
});

app.listen(port);