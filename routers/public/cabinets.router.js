var express = require('express');
var router = express.Router();

//local modules
var directory = "../../modules";
var cabinets = require(directory + '/cabinet.module.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////GET METHODES
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////GET ALL
router.get('/', function(req, res) {
    cabinets.getAll().then(function(items) {
        res.json(items);
    }, function(err) {
        console.log(err);
        res.status(500).send();
    });
});
////////////GET By ID
router.get('/:id', function(req, res) {
    if (req.params.id.length != 24) {
        cabinets.get(req.params.id).then(function(items) {
            res.json(items);
        }, function(err) {
            if (err == "Invalid ID") {
                res.status(404).send();
            } else {
                console.log(err);
                res.status(500).send();
            }
        });
    } else {
        res.status(404).send();
    }
});
////////////GET By Admin
router.get('/:id/byadmin', function(req, res) {
    if (req.params.id.length != 24) {
        cabinets.getByAdmin(req.params.id).then(function(items) {
            res.json(items);
        }, function(err) {
            console.log(err);
            res.status(404).send();
        });
    } else {
        res.status(404).send();
    }
});
////////////GET By Medecin
router.get('/:id/bymedecin', function(req, res) {
    if (req.params.id.length != 24) {
        cabinets.getByMedecin(req.params.id).then(function(items) {
            res.json(items);
        }, function(err) {
            console.log(err);
            res.status(404).send();
        });
    } else {
        res.status(404).send();
    }
});

module.exports = router;
