var passwordHash = require('password-hash');

var mysql = require("../db.js"),
    mysqlPool = mysql.createPool({
        connectionLimit: 1,
        host: "alphatrail.cifyvs8kbuxe.us-east-2.rds.amazonaws.com",
        user: "alphaomega",
        password: "wolfsquadron",
        database: "userinfo"
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
        loginParams = [req.body.email, req.body.psw],
        detailParams = [],
        updateParams = [],
        accountExistsQuery = 'SELECT * FROM users WHERE email=?',
        signupQuery = 'INSERT INTO users(email,name,password,role) VALUES(?, ?, ?, ?)',
        loginUserQuery = 'SELECT * FROM users WHERE email = ? AND password = ?',
        updateLastloginTime = 'UPDATE users SET lastLogin = ? WHERE id = ?'; //updates the date of lastlogin field
    mysqlPool.getConnection(function (err, connection) {
        connection.query(accountExistsQuery, req.body.email, function (err, rows, fields) {
            if (rows.length > 0) {
                accountExists = true;
                callback(true, JSON.stringify({"message": "Account already exists"}));
            }
        });
        if (!accountExists) {
            connection.query(signupQuery, params, function (err) {
            });
            connection.query(loginUserQuery, loginParams, function (err, rows, fields) {
                if (rows.length <= 0) {
                    connection.release();
                    callback(true, JSON.stringify({"name": "Email or password is incorrect"}));
                } else {
                    updateParams = [nowDate, rows[0].insertId];
                    detailParams = [rows[0].insertId];
                    req.session.user = rows[0];
                    connection.query(updateLastloginTime, updateParams, function (err, rows, fields) {
                        connection.query(getDetailQuery, detailParams, function (err, rows, fields) {
                            connection.release();
                            callback(null, rows[0]);
                        });
                    });
                }
            });
        }
    });
    if (!accountExists) {
        res.redirect('/maps');
    }
};

module.exports = new signup();