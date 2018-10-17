var http = require('http');
var connect = require('connect');
var express = require('express');
const goodStatus = 200;
const port = 8080;

var fs = require('fs');

var app = express();
console.log("Server is now online.\n");

app.use(express.static('C:\\Users\\mmuno\\WebstormProjects\\trail-map'));

// Route for everything else.
app.get('*', function(request, response){
    response.send('Error 404: Not found');
});

app.get("/html", function (request, response) {
    response.writeHead(goodStatus);
});

app.listen(port);