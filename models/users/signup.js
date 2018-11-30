var passwordHash = require('password-hash');
var querystring = require('querystring');

// Create the database pool for users using the database userinfo
var mysql = require("../db.js"),
    mysqlPool = mysql.createPool();
/**
 * Defines login operations.
 * @class
 */
var signup = function () {

};

/**
 * Authenticate user.
 * @Function
 * @param req - request from the client
 * @param res - response to the client
 * @param callback
 */
signup.prototype.signupUser = function (req, res, callback) {
    var params = [req.body.email, req.body.name, passwordHash.generate(req.body.psw), "User"],
        accountExistsQuery = 'SELECT * FROM users WHERE email=?',
        signupQuery = 'INSERT INTO users(email,name,password,role) VALUES(?, ?, ?, ?)';
    createPool();
    mysqlPool.getConnection(function (err, connection) {
        if (connection === undefined) {
            callback(true, "Internal Server error: pool is ended");
        } else {
            connection.query(accountExistsQuery, req.body.email, function (err, rows, fields) {
                if (rows.length > 0) {
                    connection.release();
                    callback(true, "exists");
                } else {
                    // Register the user in the database
                    connection.query(signupQuery, params, function (err) {
                        if (err) {
                            connection.release();
                            callback(true, "Internal server error");
                        }
                        connection.release();
                        callback(false, "User registered successfully");
                    });
                }
            });
        }
    });
};

function createPool() {
    if (mysqlPool === undefined) {
        mysqlPool = mysql.createPool({
            connectionLimit: 1,
            host: "alphatrail.cifyvs8kbuxe.us-east-2.rds.amazonaws.com",
            user: "alphaomega",
            password: "wolfsquadron",
            database: "userinfo",
            timeout: 3000
        });
    }
}

signup.prototype.closeConnections = function () {
    if (mysqlPool != undefined) {
        mysqlPool.end();
        mysqlPool = undefined;
    }
};

module.exports = new signup();
