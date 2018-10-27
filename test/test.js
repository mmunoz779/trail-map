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
    it('should respond with login.html to /login', function testLogin(done) {
        describe('test status returned', function () {
            request(server)
                .get('/login')
                .expect(200, done);
        });
    });
    it('should respond with map.html to /maps', function testMaps(done) {
        describe('test status returned', function () {
            request(server)
                .get('/maps')
                .expect(200, done);
        });
    });
    it('should respond with signup.html to /signup', function testSignup(done) {
        describe('test status returned', function () {
            request(server)
                .get('/signup')
                .expect(200, done);
        });
    });

    it('should respond with 200 to all /api paths', function testAPI(done) {
        describe('test status returned for /api/', function () {
            request(server)
                .get('/api')
                .expect(200);
        });
        describe('test status returned for /api/routes endpoint', function () {
            request(server)
                .get('/api/routes')
                .expect(200, done);
        });
    });

    it('should respond with 404 for everything else', function testNotFound(done) {
        request(server)
            .get("/foo/bar")
            .expect(404, done);
    });
});