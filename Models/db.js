var mysql = require('mysql');

/**
 * Defines database operations.
 * @class
 */
var DB = function () {
};

DB.prototype.createPool = function () {
    return mysql.createPool({
        host: "alphatrail.cifyvs8kbuxe.us-east-2.rds.amazonaws.com",
        user: "alphaomega",
        password: "wolfsquadron",
        database: "userinfo",
        connectionLimit: 2
    });
};

/**
 * Establishes mysql connection and returns the connection object.
 * @function
 * @param {object} pool - Mysql pool object.
 * @param {function} callback - Callback.
 */
DB.prototype.getConnection = function (pool, callback) {
    var self = this;
    pool.getConnection(function (err, connection) {
        if (err) {
            //logging here
            console.log(err);
            callback(true);
            return;
        }
        connection.on('error', function (err) {
            if (err.code === "PROTOCOL_CONNECTION_LOST") {
                connection.destroy();
            } else {
                connection.release();
            }
            console.log(err);
            callback(true);
            return;
        });
        callback(null, connection);
    });
};

module.exports = new DB();
