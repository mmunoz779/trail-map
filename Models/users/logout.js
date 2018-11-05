var mysql = require("../db.js"),
    mysqlPool = mysql.createPool();
/**
 * Defines logout operations.
 * @class
 */
var logout = function () {
};

/**
 * logging out user.
 * @Function
 * @param req
 * @param res
 * @param callback
 */
logout.prototype.logoutUser = function (req, res, callback) {
    var sess = req.session.user;
    if (sess) {
        req.session.user = null;
        return callback(null, {'success': true, "message": "user logout successfully"});
    }
    callback(null, {'success': true, "message": "user logout successfully"});
};

module.exports = new logout();