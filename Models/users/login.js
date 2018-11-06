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
var login = function () {
};

/**
 * Authenticate user.
 * @Function
 * @param callback
 */
login.prototype.loginUser = function (req, res, callback) {
    var userValidated = false;
    var nowDate = new Date().toISOString().slice(0, 19).replace('T', ' '),
        params = [req.body.email, req.body.password, 1],
        detailParams = [],
        updateParams = [],
        checkPasswordQuery = 'SELECT password FROM users WHERE email=?',
        loginUserQuery = 'SELECT * FROM users WHERE email = ?',
        getDetailQuery = 'SELECT id, email, gender, lastLogin, name, role FROM users WHERE id = ?',
        updateLastloginTime = 'UPDATE users SET lastLogin = ? WHERE id = ?'; //updates the date of lastlogin field
    mysqlPool.getConnection(function (err, connection) {
        connection.query(checkPasswordQuery, params, function (err, rows, fields) {
            if (!passwordHash.verify(req.body.password, rows[0].password)) {
                res.redirect('/login');
                userValidated = true;
            }
        });
        if (userValidated) {
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
                            callback(null, rows[0]);
                        });
                    });
                }
            });
        }
    });
    if (userValidated) {
        res.redirect("/maps");
    }
};

module.exports = new login();