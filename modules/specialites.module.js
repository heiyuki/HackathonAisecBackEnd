var data = require('./data.module.js');

//Get All
module.exports.getAll = function (query) {
    return new Promise(function (resolve, reject) {
        data.connect().then(function (db) {
            var collection = db.collection('specialites');
            collection.find(query).toArray(function (err, items) {
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

module.exports.get = function (id) {
    return new Promise(function (resolve, reject) {
        data.connect().then(function (db) {
            if (id.length == 24) {
                var collection = db.collection('specialites');
                collection.findOne(data.ObjectId(id), function (err, items) {
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
module.exports.add = function (specialite) {
        return new Promise(function (resolve, reject) {
            data.connect().then(function (db) {
                var collection = db.collection('specialites');
                collection.insert(specialite, function (err, result) {
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
module.exports.update = function (id, specialite) {
    return new Promise(function (resolve, reject) {
        data.connect().then(function (db) {
            var collection = db.collection('specialites');
            collection.updateOne({
                "_id": data.ObjectId(id)
            }, {
                $set: specialite
            }, function (err, result) {
              
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
module.exports.delete = function (id, specialite) {
    return new Promise(function (resolve, reject) {
        data.connect().then(function (db) {
            var collection = db.collection('specialites');
            collection.remove({
                "_id": data.ObjectId(id)
            }, function (err, result) {
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
module.exports.getSpecsFromIds = function(ids) {
    return new Promise(function(resolve, reject) {
        data.connect().then(function(db) {
            var specList = [];
            for (var i = 0; i < ids.length; i++) {
                if (ids[i].length == 24) {
                    specList.push(data.ObjectId(ids[i]));
                }
            }
            var collection = db.collection('specialites');
            collection.find({
                _id: {
                    $in: specList
                }
            }).toArray(function(err, items) {
                db.close();
                if (err) {
                    reject(err);
                } else {
                    resolve(items);
                }
            });
        });
    });
}