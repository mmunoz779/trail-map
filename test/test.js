var assert = require('assert');
var request = require('supertest');
var mysql = require('mysql');

describe('Server-Test', function () {
    var server;
    var testEmail = "testAccount@testAccount.test";
    // Start the server before each test
    beforeEach(function () {
        // Delete cached server import and re-initialize for clean server
        this.timeout(5000);
        delete require.cache[require.resolve('../js/server')];
        server = require('../js/server');
    });
    // Close the server after each test to ensure independence
    afterEach(function (done) {
        // Pass done to ensure the server closes
        server.close(done);
    });

    // Test routes
    it('should respond with home.html to /', function testSlash(done) {
        describe('test status returned', function () {
            request(server)
                .get('/')
                .expect('Content-Type', /html/)
                .expect(200, done);
        });
    });
    it('should respond with login.html to /login', function testLogin(done) {
        describe('test status returned', function () {
            request(server)
                .get('/login')
                .expect('Content-Type', /html/)
                .expect(200, done);
        });
    });
    it('should respond 403 forbidden error to /maps', function testMaps(done) {
        describe('test status returned', function () {
            request(server)
                .get('/maps')
                .expect(403, done);
        });
    });
    it('should respond with signup.html to /signup', function testSignup(done) {
        describe('test status returned', function () {
            request(server)
                .get('/signup')
                .expect('Content-Type', /html/)
                .expect(200, done);
        });
    });

    it('should respond with 200 to all /api paths', function testAPI(done) {
        describe('test status returned for /api/', function () {
            request(server)
                .get('/api')
                .expect('Content-Type', /text/)
                .expect(200);
        });
        describe('test status returned for /api/routes endpoint', function () {
            request(server)
                .get('/api/routes')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    it('should respond with 404 for everything else', function testNotFound(done) {
        request(server)
            .get("/foo/bar")
            .expect('Content-Type', /html/)
            .expect(404, done);
    });

    // Test user accounts
    describe('user-db-test', function () {
        describe('sign-up-tests', function () {
            it('should respond with 400 error when trying to create user that exists', function testInvalidSignup(done) {
                describe('Test status returned', function () {
                    request(server)
                        .post('/api/users/signup')
                        .type('form')
                        .send({
                            email: "admin@alphatrails.com",
                            name: "doesn't matter",
                            psw: "doesn't matter",
                            repsw: "doesn't matter"
                        })
                        .expect('Content-Type', /json/)
                        .expect(200, {
                            error: true,
                            message: "exists"
                        }, done);
                });
            });
            it('should respond with 201 success when trying to create a new user', function testValidSignup(done) {
                describe('Test status returned', function () {
                    request(server)
                        .post('/api/users/signup')
                        .type('form')
                        .send({
                            email: testEmail,
                            name: "Test user",
                            psw: "Testing",
                            repsw: "Testing"
                        })
                        .expect(302).end(function (err, res) {
                        if (err) return done(err);
                        else {
                            var connection = mysql.createConnection({
                                host: "alphatrail.cifyvs8kbuxe.us-east-2.rds.amazonaws.com",
                                user: "alphaomega",
                                password: "wolfsquadron",
                                database: "userinfo"
                            });
                            connection.connect(function (err) {
                                if (err) {
                                    console.error('error connecting: ' + err.stack);
                                    return;
                                }
                                console.log('connected as id to test DB...');
                            });
                            // Make sure account was inserted properly
                            connection.query("SELECT * FROM users WHERE email=?", testEmail, function (err, rows, fields) {
                                assert.equal(rows.length, 1);
                                console.log("Test users email: " + rows[0].email);
                            });
                            // Make sure account was deleted
                            connection.query("DELETE FROM users WHERE email=?", testEmail, function (err, results) {
                                assert.equal(results.affectedRows, 1);
                                done();
                            });
                            connection.end();
                        }
                    });
                });
            });
        });
        describe('login-tests', function () {
            it('should respond with 400 error when trying to login with an invalid email', function testInvalidUsername(done) {
                describe('Test status returned', function () {
                    request(server)
                        .post('/api/users/login')
                        .type('form')
                        .send({
                            email: "BadEmailTest@BadEmailTest.com",
                            psw: "doesn't matter",
                        })
                        .expect(200, {
                            error: true,
                            message: "does not exist"
                        }).end(function (err, res) {
                        if (err) return done(err);
                        else {
                            var connection = mysql.createConnection({
                                host: "alphatrail.cifyvs8kbuxe.us-east-2.rds.amazonaws.com",
                                user: "alphaomega",
                                password: "wolfsquadron",
                                database: "userinfo"
                            });
                            connection.connect(function (err) {
                                if (err) {
                                    console.error('error connecting: ' + err.stack);
                                    return;
                                }
                                console.log('connected as id to test DB...');
                            });
                            // Make sure account was inserted properly
                            connection.query("SELECT * FROM users WHERE email=?", testEmail, function (err, rows, fields) {
                                assert.equal(rows.length, 0);
                                done();
                            });
                            connection.end();
                        }
                    });
                });
            });
            it('should respond with 400 when trying to login with an invalid password', function testInvalidPassword(done) {
                describe('Test status returned', function () {
                    request(server)
                        .post('/api/users/login')
                        .type('form')
                        .send({
                            email: "admin@alphatrails.com",
                            psw: "incorrectPass",
                        })
                        .expect(200, {
                            error: true,
                            message: "wrong password"
                        }).end(function (err, res) {
                        if (err) return done(err);
                        else {
                            var connection = mysql.createConnection({
                                host: "alphatrail.cifyvs8kbuxe.us-east-2.rds.amazonaws.com",
                                user: "alphaomega",
                                password: "wolfsquadron",
                                database: "userinfo"
                            });
                            connection.connect(function (err) {
                                if (err) {
                                    console.error('error connecting: ' + err.stack);
                                    return;
                                }
                                console.log('connected as id to test DB...');
                            });
                            // Make sure account was inserted properly
                            connection.query("SELECT * FROM users WHERE email=?", "admin@alphatrails.com", function (err, rows, fields) {
                                assert.equal(rows.length, 1);
                                console.log("Test users email: " + rows[0].email);
                                done();
                            });
                            connection.end();
                        }
                    });
                });
                it('should respond with 400 when trying to login with an invalid password', function testInvalidPassword(done) {
                    describe('Test status returned', function () {
                        request(server)
                            .post('/api/users/login')
                            .type('form')
                            .send({
                                email: "admin@alphatrails.com",
                                psw: "incorrectPass",
                            })
                            .expect(200).end(function (err, res) {
                            if (err) return done(err);
                            else {
                                var connection = mysql.createConnection({
                                    host: "alphatrail.cifyvs8kbuxe.us-east-2.rds.amazonaws.com",
                                    user: "alphaomega",
                                    password: "wolfsquadron",
                                    database: "userinfo"
                                });
                                connection.connect(function (err) {
                                    if (err) {
                                        console.error('error connecting: ' + err.stack);
                                        return;
                                    }
                                    console.log('connected as id to test DB...');
                                });
                                // Make sure account was inserted properly
                                connection.query("SELECT * FROM users WHERE email=?", testEmail, function (err, rows, fields) {
                                    assert.equal(rows.length, 1);
                                    console.log("Test users email: " + rows[0].email);
                                });
                                connection.end();
                            }
                        });
                    });
                });
            });
        });
    });
});