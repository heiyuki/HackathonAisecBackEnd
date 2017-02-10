var express = require('express');
var router = express.Router();

//local modules
var directory = "../../modules";
var map = require(directory + '/map.module.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////GET METHODES
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////GET ALL
router.get('/:precision', function(req, res) {
    if (req.params.precision.length < 100) {
        map.getBySpecialite(req.params.precision).then(function(data) {
            var cabs = {};
            cabs.cabinets = data;
            res.send(cabs);
        }, function(err) {
            console.log(err);
            res.status(500).send();
        });
    } else {
        res.status(404).send();
    }
});


module.exports = router;
