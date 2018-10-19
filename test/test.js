var assert = require('assert');
var request = require('supertest');
var path = require('path');
var fs = require('fs');

// Configure project directory pathway
var directoryArray = __dirname.split('\\');
var projectDirectory = "";

for (var i = 0; i < directoryArray.length - 1; i++) {
    projectDirectory += directoryArray[i] + '\\';
}

describe('Server-Test', function () {
    var server;
    // Start the server before each test
    beforeEach(function () {
        // Delete cached server import and re-initialize for clean server
        delete require.cache[require.resolve('../js/server')];
        server = require('../js/server');
    });
    // Close the server after each test to ensure independence
    afterEach(function (done) {
        // Pass done to ensure the server closes
        server.close(done);
    });
    it('should respond with home.html to /', function testSlash(done) {
        describe('test status returned', function () {
            request(server)
                .get('/')
                .expect(200, done);
        });
        // describe('test html returned', function () {
        //     request(server)
        //         .get('/')
        //         .innerHTML
        //         .expect(projectDirectory + '/client/views/home.html',done);
        // });
    });
    // it('should respond with login.html for /login', function () {
    //     request(server)
    //         .get("/")
    //         .HTML
    //         .expect();
    // });
    it('should respond with 404 for everything else', function (done) {
        request(server)
            .get("/foo/bar")
            .expect(404, done);
    });
});