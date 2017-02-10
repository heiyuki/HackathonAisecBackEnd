var data = require('./data.module.js');
var userModule = require('./user.module.js');

//Get All
module.exports.getAll = function() {
    return new Promise(function(resolve, reject) {
        data.connect().then(function(db) {
            var collection = db.collection('cabinets');
            collection.find().toArray(function(err, items) {
                if (err) {
                    reject(err);
                } else {
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
                var collection = db.collection('cabinets');
                collection.findOne(data.ObjectId(id), function(err, items) {
                    if (err) {
                        db.close();
                        reject(err);
                    } else {
                        db.close();
                        resolve(items);
                    }
                });
            } else {
                reject("Invalid ID");
            }
        });
    });
}

//get By Admin
module.exports.getByAdmin = function(id) {
    return new Promise(function(resolve, reject) {
        data.connect().then(function(db) {
            if (id.length == 24) {
                var collection = db.collection('cabinets');
                collection.find({
                    "admin._id": data.ObjectId(id)
                }).toArray(function(err, items) {
                    if (err) {
                        db.close();
                        reject(err);
                    } else {
                        db.close();
                        resolve(items);
                    }
                });
            } else {
                reject("Invalid ID");
            }
        });
    });
}

//get By Medecin
module.exports.getByMedecin = function(medecinId) {
    return new Promise(function(resolve, reject) {
        data.connect().then(function(db) {
            if (medecinId.length == 24) {
                var collection = db.collection('cabinets');
                collection.find({
                    "medecin._id": data.ObjectId(medecinId)
                }).toArray(function(err, items) {
                    if (err) {
                        db.close();
                        reject(err);
                    } else {
                        db.close();
                        resolve(items);
                    }
                });
            } else {
                reject("Invalid ID");
            }
        });
    });
}

//get by specialite
module.exports.getBySpecialite = function(spec) {
    return new Promise(function(resolve, reject) {
        data.connect().then(function(db) {
            var collection = db.collection('cabinets');
            collection.find({
                "medecin.specialites.name": spec
            }).toArray(function(err, items) {
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

// Add cabinets
module.exports.add = function(specialite) {
    return new Promise(function(resolve, reject) {
        data.connect().then(function(db) {
            var collection = db.collection('cabinets');
            collection.insert(specialite, function(err, result) {
                if (err) {
                    db.close();
                    reject(err);
                } else {
                    db.close();
                    resolve();
                }
            });
        });
    });
}
// Update cabinets
module.exports.update = function(id, cabinet) {
    return new Promise(function(resolve, reject) {
        data.connect().then(function(db) {
            delete cabinet._id;
            delete cabinet.admin;
            delete cabinet.medecin;
            var collection = db.collection('cabinets');
            collection.updateOne({
                "_id": data.ObjectId(id)
            }, {
                $set: cabinet
            }, function(err, result) {
                if (err) {
                    db.close();
                    reject(err);
                } else {
                    db.close();
                    resolve();
                }
            });
        });
    });
}
// delete cabinets
module.exports.delete = function(id, specialite) {
    return new Promise(function(resolve, reject) {
        data.connect().then(function(db) {
            var collection = db.collection('cabinets');
            collection.remove({
                "_id": data.ObjectId(id)
            }, function(err, result) {
                if (err) {
                    db.close();
                    reject(err);
                } else {
                    db.close();
                    resolve();
                }
            });
        });
    });
}



// update admin and medecin
module.exports.updateAdminMedecin = function(id,user){
    return new Promise(function(resolve, reject) {
      data.connect().then(function(db) {
          var collection = db.collection('cabinets');
          user._id = id;
          collection.update({
              "admin._id": data.ObjectId(id)
          },{ '$set': {"admin" : user} }
          , function(err, result) {
              if (err) {
                  db.close();
                  reject(err);
              } else {
                  db.close();
                  resolve();
              }
          });
          collection.update({
              "medecin._id": data.ObjectId(id)
          },{ '$set': {"medecin.$" : user} }
          , function(err, result) {
              if (err) {
                  db.close();
                  reject(err);
              } else {
                  db.close();
                  resolve();
              }
          });
      });
    });
}
