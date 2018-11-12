var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('home.html');
});

router.use('/api/users', require('./users'));
router.use('/api', require('./api'));
router.use('/login', require('./login'));
router.use('/maps', require('./maps'));
router.use('/signup', require('./signup'));
router.use('/profile', require("./profile"));
router.use('/*', function (req, res) {
    res.status(404);
    res.render('pageNotFound.html');
});

module.exports = router;