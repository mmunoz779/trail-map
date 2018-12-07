var passwordHash = require('password-hash');

var mysql = require("../db.js"),
    mysqlPool = mysql.createPool();
/**
 * Defines login operations.
 * @class
 */
var login = function () {
};

/**
 * Authenticate user.
 * @Function
 * @param callback
 */
login.prototype.loginUser = function (req, res, callback) {
    var nowDate = new Date().toISOString().slice(0, 19).replace('T', ' '),
        params = [req.body.email, req.body.psw, 1],
        detailParams,
        updateParams,
        checkPasswordQuery = 'SELECT password FROM users WHERE email=?',
        loginUserQuery = 'SELECT * FROM users WHERE email = ?',
        getDetailQuery = 'SELECT id, email, lastLogin, name, role FROM users WHERE id = ?',
        updateLastloginTime = 'UPDATE users SET lastLogin = ? WHERE id = ?'; //updates the date of lastlogin field
    createPool();
    mysqlPool.getConnection(function (err, connection) {
        connection.query(checkPasswordQuery, params, function (err, rows, fields) {
            if (rows.length > 0 && !passwordHash.verify(req.body.psw, rows[0].password)) {
                connection.release();
                callback(true, 'wrong password'); // Wrong password
                return;
            } else if (rows.length <= 0) {
                connection.release();
                callback(true, 'does not exist'); // Account does not exist, redirect to login and add no account found alert
                return;
            }
            // Correct password, continue
            connection.query(loginUserQuery, params, function (err, rows, fields) {
                if (rows.length <= 0) {
                    connection.release();
                    callback(true, null);
                } else {
                    updateParams = [nowDate, rows[0].id];
                    detailParams = [rows[0].id];
                    req.session.user = rows[0];
                    connection.query(updateLastloginTime, updateParams, function (err, rows, fields) {
                        connection.query(getDetailQuery, detailParams, function (err, rows, fields) {
                            connection.release();
                            callback(false, rows[0]);
                        });
                    });
                }
            });
        });
    });
};

login.prototype.closeConnections = function () {
    if (mysqlPool != undefined) {
        mysqlPool.end();
        mysqlPool = undefined;
    }
};



function createPool() {
    if (mysqlPool === undefined) {
        mysqlPool = mysql.createPool({
            connectionLimit: 1,
            host: "alphatrail.cifyvs8kbuxe.us-east-2.rds.amazonaws.com",
            user: "alphaomega",
            password: "wolfsquadron",
            database: "userinfo",
            timeout: 3000,
            dateStrings: true
        });
    }
}

module.exports = new login();