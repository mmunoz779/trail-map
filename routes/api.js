var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/api', function (req, res, next) {
    var content = fs.readFileSync('client/JSON/loops.json');
    console.log('API was accessed');
    res.json(JSON.parse(content));
});

module.exports = router;