var mysql = require('mysql');

var con = mysql.createConnection({
    host: "alphatrail.cifyvs8kbuxe.us-east-2.rds.amazonaws.com",
    user: "alphaomega",
    password: "wolfsquadron"
});

con.connect(function (err) {
    if (err)
        throw err;
    console.log("Database Connected");
    con.query("USE userinfo", function (err, result) {
        if (err)
            throw err;
        console.log("Database selected");
    });
});

function close() {
    con.disconnect();
}

module.exports = con;
