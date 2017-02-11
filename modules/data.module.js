var mongo = require('mongodb');
var ObjectId = mongo.ObjectId;

module.exports.ObjectId = ObjectId;

//connect to database returns a promise
module.exports.connect = function () {
    return new Promise(function (resolve, reject) {
        var client = mongo.MongoClient;
        var url = "mongodb://localhost:27017/yedwahda"
        client.connect(url, function (err, db) {
            if (err) {
                reject(err);
            } else {
                resolve(db);
            }
        });
    });
}
