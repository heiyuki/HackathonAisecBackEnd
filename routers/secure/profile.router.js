var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');



//local modules
var directory = "../../modules";
var users = require(directory + '/user.module.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////GET METHODES
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////GET ALL
router.get('/', function(req, res) {
    var token = req.headers['authorization'];
    var dec = jwt.decode(token);
    users.findUserByEmail(dec.email).then(function(data) {
        delete data.password;
        res.status(200).send(data);
    }, function() {
        res.status(404).send();
    });

});
router.put('/', function(req, res) {
    var token = req.headers['authorization'];
    var dec = jwt.decode(token);
    if (req.body.oldPassword) {
        users.findUserByEmail(dec.email).then(function(data) {
            users.compare(req.body.oldPassword, data.password).then(function() {
                users.hashPassword(req.body.password).then(function(hash) {
                    req.body.password = hash;
                    delete req.body.oldPassword;
                    users.update(data._id, req.body).then(function() {
                        res.status(202).send();
                    }, function() {
                        res.status(400).send();
                    });
                }, function() {
                    res.status(500).send();
                });
            }, function() {
                res.status(400).send();
            });
        }, function() {
            res.status(500).send();
        });
    } else {
        users.findUserByEmail(dec.email).then(function(data) {
            req.body.password = data.password;
            users.update(data._id, req.body).then(function() {
                res.status(202).send();
            }, function() {
                res.status(400).send();
            });
        }, function() {
            res.status(500).send();
        });
    }
});
module.exports = router;