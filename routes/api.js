var express = require('express');
var router = express.Router();
var fs = require('fs');

router.use('/api', function (req, res, next) {
    // Add middleware to handle time logging
    console.log('API was accessed at ' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));
    next();
});

router.get('/api/routes', function (req, res, next) {
    var content = fs.readFileSync('client/JSON/loops.json');
    res.json(JSON.parse(content));
});

router.get('/api', function (req, res, next) {
    res.send("Available endpoints:\r\nroutes: returns JSON containing possible routes");
});

router.post("/api/routes", function (req, res, next) {
    var content = fs.readFileSync('client/JSON/loops.json');

    var data = JSON.parse(content);
    data.push({
            name: "",
            distance: "",
            imagePath: ""
        }
    );
    console.log(data);
    res.send("Post request received");
    //fs.writeFileSync('client/JSON/loops.json', data);
});

module.exports = router;