var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var ObjectId = mongo.ObjectId;
var mongoport = 204;
//local modules
var directory = "../../modules";
var mouvements = require(directory + '/mouvements.module.js');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////GET METHODES
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////GET ALL
router.get('/', function(req, res) {
    var query = {};
    if (req.headers['if-match']) {
        query.name = req.headers['if-match'];
    }
    mouvements.getAll(query).then(function(items) {
        res.json(items);
    }, function(err) {
        console.log(err);
        res.status(500).send();
    });
});
////////////GET By ID
router.get('/:id', function(req, res) {
    if (req.params.id.length != 24) {
        mouvements.get(req.params.id).then(function(items) {
            res.json(items);
        }, function(err) {
            if (err == "Invalid ID") {
                res.status(400).send();
            } else {
                console.log(err);
                res.status(500).send();
            }
        });
    } else {
        res.status(404).send();
    }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////POST METHODES
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////POST
router.post('/', function(req, res) {
    mouvements.add(req.body).then(function(result) {
        res.status(201).send(result);
    }, function() {
        console.log("Unable to Add mouvements");
        res.status(500).send();
    });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////PUT METHODES
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////PUT
router.put('/:id', function(req, res) {
    if (req.params.id.length == 24) {
        mouvements.update(req.params.id, req.body).then(function(result) {
            res.status(202).send(result);
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
        mouvements.delete(req.params.id).then(function() {
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
