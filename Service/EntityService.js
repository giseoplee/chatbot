var dbService = require('./SequelizeService.js');
var log = require("../Entity/Log.js");

var EntityService = () => {};

EntityService.Init = () => {

    var result = log.sync().then().catch((error) => {

        console.log("### TABLE CREATE ERROR START ###");
        console.log(error);
        console.log("### TABLE CREATE ERROR END ###");
    });
}

module.exports = EntityService;
