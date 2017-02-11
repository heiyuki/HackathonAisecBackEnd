var data = require('./data.module.js');
var Cabinets = require('./cabinet.module.js');
var bcrypt = require('bcryptjs');

//inserts a use in a specific collection
module.exports.addUser = function(user) {
    return new Promise(function(resolve, reject) {
        data.connect().then(function(db) {
            var collection = db.collection('users');
            collection.insert(user, function(err, result) {
                db.close();
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });
}


//Hashs the password of a user than executes callback
module.exports.hashPassword = function(password) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        });
    });
}

//check if email already used then executes callback
module.exports.findUserByEmail = function(email) {
    return new Promise(function(resolve, reject) {
        data.connect().then(function(db) {
            var collection = db.collection('users');
            collection.find({
                email: email
            }).toArray(function(err, items) {
                db.close();
                if (items.length != 0) {
                    resolve(items[0]);
                } else {
                    reject();
                }
            });
        });
    });
}

//Check for user password
module.exports.compare = function(p1, p2) {
        return new Promise(function(resolve, reject) {
            bcrypt.compare(p1, p2).then(function(result) {
                if (result) {
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }
    //Update User
module.exports.update = function(id, user) {
    return new Promise(function(resolve, reject) {
        data.connect().then(function(db) {
            var collection = db.collection('users');
            delete user._id;
            Cabinets.updateAdminMedecin(id,user);
            collection.updateOne({
                "_id": data.ObjectId(id)
            }, {
                $set: user
            }, function(err, result) {
                db.close();
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });
}

module.exports.getAll = function() {
    return new Promise(function(resolve, reject) {
        data.connect().then(function(db) {
            var collection = db.collection('users');
            collection.find().toArray(function(err, result) {
                db.close();
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    });
}

module.exports.publicGetAll = function() {
    return new Promise(function(resolve, reject) {
        data.connect().then(function(db) {
            var collection = db.collection('users');
            collection.find().toArray(function(err, result) {
                db.close();
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    for (var i = 0; i < result.length; i++) {
                        delete result[i].password;
                    }
                    resolve(result);
                }
            });
        });
    });
}

module.exports.publicGet = function(id) {
    return new Promise(function(resolve, reject) {
        data.connect().then(function(db) {
            if (id.length == 24) {
                var collection = db.collection('users');
                collection.findOne(data.ObjectId(id), function(err, items) {
                    db.close();
                    if (err) {
                        reject(err);
                    } else {
                        delete items.password;
                        resolve(items);
                    }
                });
            } else {
                reject("Invalid ID");
            }
        });
    });
}

module.exports.publicGetUsersFromIds = function(ids) {
    return new Promise(function(resolve, reject) {
        data.connect().then(function(db) {
            var usersList = [];
            for (var i = 0; i < ids.length; i++) {
                if (ids[i].length == 24) {
                    usersList.push(data.ObjectId(ids[i]));
                }
            }
            var collection = db.collection('users');
            collection.find({
                _id: {
                    $in: usersList
                }
            }).toArray(function(err, items) {
                db.close();
                if (err) {
                    reject(err);
                } else {
                  for (var i = 0; i < items.length; i++) {
                      delete items[i].password;
                  }
                    delete items.password;
                    resolve(items);
                }
            });
        });
    });
}
