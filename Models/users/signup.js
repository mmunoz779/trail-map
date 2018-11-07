var passwordHash = require('password-hash');

var mysql = require("../db.js"),
    mysqlPool = mysql.createPool({
        connectionLimit: 1,
        host: "alphatrail.cifyvs8kbuxe.us-east-2.rds.amazonaws.com",
        user: "alphaomega",
        password: "wolfsquadron",
        database: "userinfo",
        timeout: 3000
    });
/**
 * Defines login operations.
 * @class
 */
var signup = function () {
};

/**
 * Authenticate user.
 * @Function
 * @param callback
 */
signup.prototype.signupUser = function (req, res, callback) {
    var accountExists = false;
    var nowDate = new Date().toISOString().slice(0, 19).replace('T', ' '),
        params = [req.body.email, req.body.name, passwordHash.generate(req.body.psw), "User"],
        accountExistsQuery = 'SELECT * FROM users WHERE email=?',
        signupQuery = 'INSERT INTO users(email,name,password,role) VALUES(?, ?, ?, ?)'
    mysqlPool.getConnection(function (err, connection) {
        connection.query(accountExistsQuery, req.body.email, function (err, rows, fields) {
            if (rows.length > 0) {
                callback(true, JSON.stringify({"error": 402, "message": "Bad request: account already exists"}));
            } else {
                connection.query(signupQuery, params, function (err) {
                    if (err)
                        callback(true, JSON.stringify({
                            "error": 500,
                            "message": "Internal server error: unable to create account"
                        }));
                    callback(false, JSON.stringify({"success": 201, "message": "User registered successfully"}));
                });
            }
        });
    });
};

module.exports = new signup();