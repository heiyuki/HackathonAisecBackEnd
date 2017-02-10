var cabinetsModule = require('./cabinet.module.js');

module.exports.getBySpecialite = function(precision) {
    return new Promise(function(resolve, reject) {
        cabinetsModule.getBySpecialite(precision).then(function(data) {
            resolve(data);
        }, function(err) {
            reject(err);
        });
    });
}