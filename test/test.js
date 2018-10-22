var assert = require('assert');
var request = require('supertest');
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
    });
    it('should respond with login.html to /login', function testSlash(done) {
        describe('test status returned', function () {
            request(server)
                .get('/login')
                .expect(200, done);
        });
    });
    it('should respond with map.html to /map', function testSlash(done) {
        describe('test status returned', function () {
            request(server)
                .get('/map')
                .expect(200, done);
        });
    });
    it('should respond with signup.html to /signup', function testSlash(done) {
        describe('test status returned', function () {
            request(server)
                .get('/signup')
                .expect(200, done);
        });
    });

    it('should respond with 404 for everything else', function (done) {
        request(server)
            .get("/foo/bar")
            .expect(404, done);
    });
});