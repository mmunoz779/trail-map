var express = require('express'),
    router = express.Router(),
    login = require('../models/users/login');
logout = require('../models/users/logout');
signup = require('../models/users/signup');
info = require('../models/users/info');
routes = require('../models/users/routes');

router.use('/', function (req, res, next) {
    // Add middleware to handle time logging
    console.log('Users API was accessed at ' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));
    next();
});

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

// Handle user registration
router.post('/signup', function (req, res) {
    signup.signupUser(req, res, function (err, data) {
        if (err) {
            data = JSON.parse(data);
            if (data.message.toString().indexOf("already exists") > 0) {
                // Set bad request status and redirect to account exists page (replace with login page and warning later)
                res.status(400);
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

// Handle logout functionality
router.post('/logout', function (req, res) {
    logout.logoutUser(req, res, function (err, data) {
        // Respond with error message if unable to logout successfully
        if (err) {
            res.json({'error': data.error, 'message': data.message});
            return;
        } else {
            // Redirect user home on successful logout
            return res.redirect('/'); // User logged out
            return;
        }
    });
});

router.get('/info', function (req, res) {
    info.getUserInfo(req, res, function (err, data) {
        if (err) {
            res.json({'error': data.error, 'message': data.message});
        } else {
            res.send(data);
        }
    });
});

router.get('/routes', function (req, res) {
    routes.getUserRoutes(req, res, function (err, data) {
        if (err) {
            res.json({'error': data.error, 'message': data.message});
        } else {
            res.send(data);
        }
    })
});

module.exports = router;