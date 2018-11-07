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
                accountExists = true;
                callback(true, JSON.stringify({"error": "402: Bad request", "message": "Account already exists"}));
            }
        });
        if (!accountExists) {
            connection.query(signupQuery, params, function (err) {
            });
        }
    });
};

module.exports = new signup();