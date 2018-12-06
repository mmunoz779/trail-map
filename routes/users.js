var express = require('express'),
    router = express.Router(),
    login = require('../models/users/login');
logout = require('../models/users/logout');
signup = require('../models/users/signup');
info = require('../models/users/info');
routes = require('../models/users/routes');

router.use('/', function (req, res, next) {
    // Add middleware to handle time logging
    console.log('Users API was accessed at ' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ' '));
    next();
});

router.post('/login', function (req, res) {
    login.loginUser(req, res, function (err, data) {
        if (err) {
            res.json({'error': true, 'message': data});
        } else {
            res.json({'error': false, 'message': 'Logged in successfully'});
        }
    });
});

// Handle user registration
router.post('/signup', function (req, res) {
    signup.signupUser(req, res, function (err, data) {
        if (err) {
                // Set bad request status and redirect to account exists page (replace with login page and warning later)
            res.json({'error': true, 'message': data});
            } else {
            res.json({'error': false, 'message': data.message});
            }
        }
    );
});

// Handle logout functionality
router.post('/logout', function (req, res) {
    logout.logoutUser(req, res, function (err, data) {
        // Respond with error message if unable to logout successfully
        if (err) {
            res.json({'error': data.error, 'message': data.message});
        } else {
            // Redirect user home on successful logout
            return res.redirect('/'); // User logged out
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

router.post('/routes/delete', function (req, res) {
    routes.deleteRoutes(req, res, function (err, data) {
        if (err) {
            res.json({'error': data.error, 'message': data.message});
        } else {
            res.json({'error': false, 'message': 'Successfully deleted'});
        }
    })
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

router.post('/routes', function (req, res) {
    routes.setUserRoutes(req, res, function (err, data) {
        if (err) {
            res.json({'error': true, 'message': data.message});
        } else {
            res.json(200, {'error': false, 'message': 'Route Added Successfully'});
        }
    })
});

module.exports = router;