var data = require('./data.module.js');

//Get All
module.exports.getAll = function(query) {
    return new Promise(function(resolve, reject) {
        data.connect().then(function(db) {
            var collection = db.collection('mouvements');
            collection.find(query).toArray(function(err, items) {
                if (err) {
                    db.close();
                    reject(err);
                } else {
                    db.close();
                    resolve(items);
                }
            });
        });
    });
}


//Get By Id

module.exports.get = function(id) {
    return new Promise(function(resolve, reject) {
        data.connect().then(function(db) {
            if (id.length == 24) {
                var collection = db.collection('mouvements');
                collection.findOne(data.ObjectId(id), function(err, items) {
                    db.close();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(items);
                    }
                });
            } else {
                reject("Invalid ID");
            }
        });
    });
}
//Get By Id

module.exports.getByAuthor = function(id) {
    return new Promise(function(resolve, reject) {
        data.connect().then(function(db) {
            if (id.length == 24) {
                var collection = db.collection('mouvements');
                collection.find({
                    "admin": data.ObjectId(id)
                }).toArray(function(err, items) {
                    db.close();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(items);
                    }
                });
            } else {
                reject("Invalid ID");
            }
        });
    });
}
// Add Specialite
module.exports.add = function(specialite) {
    return new Promise(function(resolve, reject) {
        data.connect().then(function(db) {
            var collection = db.collection('mouvements');
            collection.insert(specialite, function(err, result) {
                db.close();
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    });
}
// Update Specialite
module.exports.update = function(id, specialite) {
    return new Promise(function(resolve, reject) {
        data.connect().then(function(db) {
            var collection = db.collection('mouvements');
            collection.updateOne({
                "_id": data.ObjectId(id)
            }, {
                $set: specialite
            }, function(err, result) {

                db.close();
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    });
}
// delete Specialite
module.exports.delete = function(id, specialite) {
    return new Promise(function(resolve, reject) {
        data.connect().then(function(db) {
            var collection = db.collection('mouvements');
            collection.remove({
                "_id": data.ObjectId(id)
            }, function(err, result) {
                db.close();
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    });
}
