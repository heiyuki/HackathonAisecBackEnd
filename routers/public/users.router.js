var express = require('express');
var router = express.Router();
//local modules
var directory = "../../modules";
var users = require(directory + '/user.module.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////Request handling
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Register User
router.get('/', function(req, res) {
    users.publicGetAll().then(function(data) {
        res.send(data);
    });
});

router.get('/:id', function(req, res) {
    if (req.params.id.length != 24) {
        users.publicGet(req.params.id).then(function(data) {
            res.send(data);
        });
    } else {
        res.status(404).send();
    }
});
module.exports = router;
