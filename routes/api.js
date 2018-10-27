var express = require('express');
var router = express.Router();
var fs = require('fs');

router.use('/api', function (req, res, next) {
    // Add middleware to handle time logging
    console.log('API was accessed at ' + Date.now().toLocaleString());
    next();
});

router.get('/api/routes', function (req, res, next) {
    var content = fs.readFileSync('client/JSON/loops.json');
    res.json(JSON.parse(content));
});

router.get('/api', function (req, res, next) {
    res.send("Available endpoints:\r\nroutes: returns JSON containing possible routes");
});

module.exports = router;