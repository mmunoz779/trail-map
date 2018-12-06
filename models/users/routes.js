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
            getRoutesQuery = 'SELECT name, route, distance FROM savedRoutes WHERE email = ?';
        createPool();
        mysqlPool.getConnection(function (err, connection) {
            connection.query(checkPasswordQuery, params, function (err, rows, fields) {
                if (rows.length <= 0) {
                    connection.release();
                    res.redirect(400, '/login'); // Account does not exist, redirect to login and add no account found alert
                    return;
                }
                // Correct password, continue
                connection.query(getRoutesQuery, params, function (err, rows, fields) {
                    if (rows.length <= 0) {
                        connection.release();
                        callback(true, 'No routes found');
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

routes.prototype.deleteRoutes = function (req, res, callback) {
    if (req.session.user) {
        var params = [req.session.user.email],
            deleteParams = [req.session.user.email, req.body.name],
            checkPasswordQuery = 'SELECT password FROM users WHERE email=?',
            deleteRoutesQuery = 'DELETE FROM savedRoutes WHERE email=? and name=?';
        createPool();
        mysqlPool.getConnection(function (err, connection) {
            connection.query(checkPasswordQuery, params, function (err, rows, fields) {
                if (rows.length <= 0) {
                    connection.release();
                    res.redirect(400, '/login'); // Account does not exist, redirect to login and add no account found alert
                    return;
                }
                // Correct password, continue
                connection.query(deleteRoutesQuery, deleteParams, function (err, result) {
                    if (result.affectedRows == 0) {
                        connection.release();
                        callback(true, 'unable to delete');
                    } else {
                        connection.release();
                        callback(false, result.affectedRows);
                    }
                });
            });
        });
    } else {
        res.redirect('/login');
    }
};

/**
 * Authenticate user.
 * @Function
 * @param callback
 */
routes.prototype.setUserRoutes = function (req, res, callback) {
    if (req.session.user) {
        var params = [req.body.name, req.session.user.email, req.body.route, req.body.distance],
            passParams = [req.session.user.email],
            checkRouteParams = [req.body.name, req.session.user.email],
            updateParams = [req.body.route, req.body.distance, req.body.name, req.session.user.email],
            checkPasswordQuery = 'SELECT password FROM users WHERE email=?',
            setRoutesQuery = 'INSERT INTO savedRoutes(name,email,route,distance) VALUES(?,?,?,?)',
            updateRouteQuery = 'UPDATE savedRoutes SET route=?,distance=? WHERE name=? AND email=?',
            checkRouteNameQuery = 'SELECT * FROM savedRoutes WHERE name=? AND email=?';
        createPool();
        mysqlPool.getConnection(function (err, connection) {
            connection.query(checkPasswordQuery, passParams, function (err, rows, fields) {
                if (rows.length <= 0) {
                    connection.release();
                    res.redirect(400, '/login'); // Account does not exist, redirect to login and add no account found alert
                    return;
                }
                connection.query(checkRouteNameQuery, checkRouteParams, function (err, rows, fields) {
                    if (rows.length > 0) {
                        // Route exists, update instead
                        connection.query(updateRouteQuery, updateParams, function (err, result) {
                            console.log("updating Routes");
                            if (err || result.affectedRows == 0) {
                                connection.release();
                                callback(true, 'error occurred');
                            } else {
                                connection.release();
                                callback(false, result);
                            }
                        });
                    } else {
                        // Correct password, new route name
                        connection.query(setRoutesQuery, params, function (err) {
                            console.log("Inserting route");
                            if (err) {
                                connection.release();
                                callback(true, 'error occurred');
                            } else {
                                connection.release();
                                callback(false, rows);
                            }
                        });
                    }
                })
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