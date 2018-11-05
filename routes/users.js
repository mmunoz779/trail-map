var express = require('express'),
    router = express.Router(),
    login = require('../models/users/login');
logout = require('../models/users/logout');

router.post('/login', function (req, res) {
    login.loginUser(req, res, function (err, data) {
        if (err) {
            res.json({'error': true, 'message': 'Error logged in'});
        } else {
            res.json({'success': true, 'data': data});
        }
    });
});

router.post('/logout', function (req, res) {
    logout.logoutUser(req, res, function (err, data) {
        if (err) {
            res.json({'error': data.error, 'message': data.message});
        } else {
            res.json({'success': data.success, 'message': data.message});
        }
    });
});

module.exports = router;