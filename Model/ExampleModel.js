/* sequelize transaction example */

var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');
var user = require('../Entity/User.js');

var UserModel = (data) => {
    this.data = data;
}

/* Create */
UserModel.Insert = (callback) => {

    user.create(
        { account : "test0", password : "passowrd0" }
    )
    .then(result => {
        callback(result);
    })
    .catch(error => {
        callback(error);
    });
}

/* Read */
UserModel.List = (callback) => {

    user.findAll({
        where : {
          $and : [{ id : {$lt : 3}}, {account : {$like : "%test%"}}]
        },
        limit : 2,
        raw : true
    })
    .then(result => {
        callback(result);
    })
    .catch(error => {
        callback(error);
    });
}

/* Update */
UserModel.Update = (callback) => {

    user.update(
        { password : "test123$" },
        { where : [{ id : {$lt : 3}}, {account : {$like : "%test%"}}] }
    )
    .then(result => {
        callback(result);
    })
    .catch(error => {
        callback(error);
    });
}

/* Delete */
UserModel.Delete = (callback) => {

    user.destroy(
        { where : [{account : "test0", password : "passowrd0"}] }
    )
    .then(result => {
        callback(result);
    })
    .catch(error => {
        callback(error);
    });
}

UserModel.FindAndCreate = (data, callback) => {

    user.findAll({

    })
}

module.exports = UserModel;
