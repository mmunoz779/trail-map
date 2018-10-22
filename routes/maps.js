var express = require('express');
var router = express.Router();

router.get('/maps', function (req, res, next) {
    res.render('maps.html');
});

module.exports = router;