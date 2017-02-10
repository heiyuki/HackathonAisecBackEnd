const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const sanitizer = require('sanitizer');

//local modules
const directory = "../../modules";
const users = require(directory + '/user.module.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////Request handling
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Register User
router.post('/register', function(req, res) {

    if (req.body.firstName.length < 1000 ||
        req.body.lastName.length < 1000 ||
        req.body.email.length < 1000 ||
        req.body.phone.length < 1000 ||
        req.body.password.length < 1000 ||
        req.body.confirmPassword.length < 1000 ||
        req.body.dateNaissance.length < 1000 ||
        req.body.adresse.length < 1000 ||
        req.body.country.length < 1000
    ) {
        //Validation
        req.checkBody('firstName').notEmpty();
        req.checkBody('lastName').notEmpty();
        req.checkBody('email').notEmpty();
        req.checkBody('email').isEmail();
        req.checkBody('phone').notEmpty();
        req.checkBody('password').notEmpty().equals(sanitizer.escape(req.body.password));
        req.checkBody('confirmPassword').equals(req.body.password);
        req.checkBody('dateNaissance').notEmpty();
        req.checkBody('adresse').notEmpty();
        req.checkBody('country').notEmpty();

        var errors = req.validationErrors();

        if (!errors) {
            var user = {
                firstName: sanitizer.sanitize(req.body.firstName),
                lastName: sanitizer.escape(req.body.lastName),
                email: sanitizer.escape(req.body.email),
                phone: sanitizer.escape(req.body.phone),
                password: sanitizer.escape(req.body.password),
                dateNaissance: sanitizer.escape(req.body.dateNaissance),
                adresse: sanitizer.escape(req.body.adresse),
                country: sanitizer.escape(req.body.country)
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
        users.hashPassword(user.password).then(function(hash) {
                users.findUserByEmail(user.email).then(function(data) {
                        if (data) {
                            users.compare(user.password, data.password).then(function() {
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
            },
            function() {
                console.log("Unable to Hash Client Password");
                res.status(500).send({
                    status: 500
                });
            });
    } else {
        res.status(413).send({
            status: 413
        });
    }
});


module.exports = router;
