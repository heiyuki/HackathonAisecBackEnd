const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const sanitizer = require('sanitizer');
const randomstring = require("randomstring");


//local modules
const directory = "../../modules";
const users = require(directory + '/user.module.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////Request handling
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Register User
router.post('/register', function(req, res) {

    if (req.body.email.length < 100 ||
        req.body.password.length < 100 ||
        req.body.confirmPassword.length < 100
    ) {
        //Validation
        req.checkBody('email').notEmpty();
        req.checkBody('email').isEmail();
        req.checkBody('password').notEmpty().equals(sanitizer.escape(req.body.password));
        req.checkBody('confirmPassword').equals(req.body.password);

        var errors = req.validationErrors();

        if (!errors) {
            var salt = randomstring.generate(8);
            var pass = salt + req.body.password;
            var user = {
                email: sanitizer.escape(req.body.email),
                password: sanitizer.escape(pass),
                salt: salt
            }
            users.hashPassword(user.password).then(function(hash) {
                    user.password = hash;
                    users.findUserByEmail(user.email).then(function(data) {
                            res.status(400).send({
                                status: 400
                            });
                        },
                        function() {
                            users.addUser(user).then(function() {
                                    res.status(201).send({
                                        status: 201
                                    });
                                },
                                function() {
                                    console.log("Unable to Register User");
                                    res.status(500).send({
                                        status: 500
                                    });
                                });
                        });
                },
                function() {
                    console.log("Unable to Hash Password");
                    res.status(500).send({
                        status: 500
                    });
                });
        } else {
            res.status(400).send({
                errors: errors
            });
        }
    } else {
        res.status(413).send({
            errors: errors
        });
    }
});

router.post('/login', function(req, res) {
    if (req.body.email.length < 1000) {
        var user = {
            email: sanitizer.escape(req.body.email),
            password: sanitizer.escape(req.body.password)
        }
        users.findUserByEmail(user.email).then(function(data) {
                if (data) {
                    users.compare(data.salt + user.password, data.password).then(function() {
                        var payload = {
                            email: data.email,
                            password: data.password
                        }
                        var token = jwt.sign(payload, process.env.SECRET_KEY, {
                            expiresIn: 3600
                        });
                        delete data.password;
                        res.status(200).json({
                            success: true,
                            token: token,
                            user: data
                        });
                    }, function() {
                        console.log("Invalid Credentials");
                        res.status(400).send({
                            status: 400
                        });
                    });
                } else {
                    console.log("Invalid Credentials");
                    res.status(400).send({
                        status: 400
                    });
                }

            },
            function() {
                console.log("User Not Found");
                res.status(400).send({
                    status: 400
                });
            });
    } else {
        res.status(413).send({
            status: 413
        });
    }
});


module.exports = router;
