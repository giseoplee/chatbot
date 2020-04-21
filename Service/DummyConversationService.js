"use strict";

var moment = require("moment");

var config = require("../Common/Config.js");
var common = require("../Common/Common.js");
var redis = require("../Service/RedisService.js");

var DummyConversationService = () => {};

DummyConversationService.Init = () => {
  config.dummyData.context.time = moment().format("YYYY-MM-DD HH:mm:ss");
  config.dummyData.context.expires = moment()
    .add("minutes", 60)
    .valueOf();

  redis.context
    .set(config.dummyUserKey, JSON.stringify(config.dummyData.context))
    .then(result => {
      if (result != "OK") {
        console.log("## UNKNOWN DUMMY DATA INITIALIZE ERROR START ##");
        console.log(result);
        console.log("## UNKNOWN DUMMY DATA INITIALIZE ERROR END ##");
      } else {
        console.log("## setup dummy data ##");
      }
    })
    .catch(error => {
      console.log("## DUMMY DATA INITIALIZE ERROR START ##");
      console.log(error);
      console.log("## DUMMY DATA INITIALIZE ERROR END ##");
    });
};

DummyConversationService.GetConversationResponse = callback => {
  let key = config.dummyUserKey;
  let type = config.dummyMessageType;
  let content = config.dummyInputContent;
  let context = {};

  redis.context
    .get(key)
    .then(result => {
      if (result != null) {
        context = JSON.parse(result);
      }

      config.dummyData.context.time = moment().format("YYYY-MM-DD HH:mm:ss");
      config.dummyData.context.expires = moment()
        .add("minutes", 60)
        .valueOf();

      var data = redis.context.set(
        key,
        JSON.stringify(config.dummyData.context),
        () => {
          common.SetLogContent(config.dummyData, key);
          callback(config.dummyData);
        }
      );
    })
    .catch(error => {
      throw error;
    });
};

module.exports = DummyConversationService;
