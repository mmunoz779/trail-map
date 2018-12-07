var mysql = require("../db.js"),
    mysqlPool = mysql.createPool();
/**
 * Defines login operations.
 * @class
 */
var info = function () {
};

/**
 * Authenticate user.
 * @Function
 * @param callback
 */
info.prototype.getUserInfo = function (req, res, callback) {
    if (req.session.user) {
        var nowDate = new Date().toISOString().slice(0, 19).replace('T', ' '),
            params = [req.session.user.email],
            checkPasswordQuery = 'SELECT password FROM users WHERE email=?',
            getDetailQuery = 'SELECT id, email, DATE_FORMAT(CONVERT_TZ(lastLogin,\'GMT\',\'EST\'),\'%c/%e/%y %h:%i:%s %p\') lastLogin, name, role FROM users WHERE email = ?';
        createPool();
        mysqlPool.getConnection(function (err, connection) {
            connection.query(checkPasswordQuery, params, function (err, rows, fields) {
                if (rows.length <= 0) {
                    res.redirect(400, '/login'); // Account does not exist, redirect to login and add no account found alert
                    return;
                }
                // Correct password, continue
                connection.query(getDetailQuery, params, function (err, rows, fields) {
                    if (rows.length <= 0) {
                        connection.release();
                        callback(true, null);
                    } else {
                        connection.release();
                        callback(false, rows);
                    }
                });
            });
        });
    } else {
        res.redirect('/login');
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

module.exports = new info();