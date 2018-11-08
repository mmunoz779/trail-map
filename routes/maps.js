var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    if (req.session.user) {
        res.render('maps.html');
    } else {
        return res.redirect(403, "/login");// User is not logged in or session has expired
    }
});

module.exports = router;