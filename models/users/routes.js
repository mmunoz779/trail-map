var passwordHash = require('password-hash');

var mysql = require("../db.js"),
    mysqlPool = mysql.createPool();
/**
 * Defines login operations.
 * @class
 */
var routes = function () {
};

/**
 * Authenticate user.
 * @Function
 * @param callback
 */
routes.prototype.getUserRoutes = function (req, res, callback) {
    if (req.session.user) {
        var params = [req.session.user.email],
            checkPasswordQuery = 'SELECT password FROM users WHERE email=?',
            getRoutesQuery = 'SELECT id, name, email, route, image FROM users WHERE email = ?';
        createPool();
        mysqlPool.getConnection(function (err, connection) {
            connection.query(checkPasswordQuery, params, function (err, rows, fields) {
                if (rows.length <= 0) {
                    res.redirect(400, '/login'); // Account does not exist, redirect to login and add no account found alert
                    return;
                }
                // Correct password, continue
                connection.query(getRoutesQuery, params, function (err, rows, fields) {
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

routes.prototype.closeConnections = function () {
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
            timeout: 3000
        });
    }
}

module.exports = new routes();