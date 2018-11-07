var express = require('express'),
    router = express.Router(),
    login = require('../models/users/login');
logout = require('../models/users/logout');
signup = require('../models/users/signup');

router.post('/login', function (req, res) {
    login.loginUser(req, res, function (err, data) {
        if (err) {
            res.json({'error': true, 'message': 'Error logged in'});
            return;
        } else {
            res.redirect('/maps');
            return;
        }
    });
});

router.post('/signup', function (req, res) {
    signup.signupUser(req, res, function (err, data) {
        if (err) {
            data = JSON.parse(data);
            if (data.message == "Account already exists") {
                res.render("accountExists.html");
            } else {
                res.json({'error': data.error, 'message': data.message});
            }
            return;
        } else {
            res.redirect('/login');
            return;
        }
    });
});

router.post('/logout', function (req, res) {
    logout.logoutUser(req, res, function (err, data) {
        if (err) {
            res.json({'error': data.error, 'message': data.message});
            return;
        } else {
            res.redirect('/');
            return;
        }
    });
});

module.exports = router;