var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

//local modules
var directory = "../../modules";
var cabinets = require(directory + '/cabinet.module.js');
var users = require(directory + '/user.module.js');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////POST METHODES
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////POST 
router.post('/', function(req, res) {
    var token = req.headers['authorization'];
    var dec = jwt.decode(token);
    users.findUserByEmail(dec.email).then(function(data) {
        req.body.admin = data;
        delete req.body.admin.password;
        if (!req.body.medecin) {
            req.body.medecin = [];
        }
        delete req.body.medecin.password;
        req.body.medecin.push(data);
        cabinets.add(req.body).then(function() {
            res.status(201).send();
        }, function() {
            console.log("Unable to Add Cabinets");
            res.status(500).send();
        });
    });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////PUT METHODES
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////PUT 
router.put('/:id', function(req, res) {
    if (req.params.id.length == 24) {
        cabinets.update(req.params.id, req.body).then(function() {
            res.status(202).send();
        }, function() {
            res.status(500).send();
        });
    } else {
        console.log("This ID is not Valid");
        res.status(400).send();
    }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////DELETE METHODS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////DELETE 
router.delete('/:id', function(req, res) {
    if (req.params.id.length == 24) {
        cabinets.delete(req.params.id).then(function() {
            res.status(202).send();
        }, function() {
            res.status(500).send();
        });
    } else {
        console.log("This ID is not Valid");
        res.status(400).send();
    }
});

module.exports = router;