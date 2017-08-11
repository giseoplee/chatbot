'use strict';

var Conversation = require('watson-developer-cloud/conversation/v1');

var config = require('../Common/Config.js');
var redis = require('../Service/RedisService.js');

//var redisio = redis.redis;

var ConversationService = function(){};

ConversationService.Init = function(){

      //var conversation = new Conversation(config.conversationConfig.conversation);
      var conversation = new Conversation(config.conversationConfig.conversation);

      // let getConversationResponse = (message, context) => {
      //     let payload = {
      //       workspace_id : config.conversationConfig.workspace_id,
      //       context : context || {},
      //       input : message || {}
      //     }
      // }
      //
      // payload = preProcess(payload);
      //
      // return new Promise((resolved, rejected) => {
      //
      //
      // })
      //onsole.log(redis.redis.set("key" , "value"));
      //console.log(redis);
      // redis.redis.set("key", "value");
      // redis.redis.get("key", (err, result) => { console.log(result); });

      redis.redis.set("key", "value");
      ConversationService.SendMessage("key1", "text", "hello");
}

ConversationService.SendMessage = (useKey, messageType, messageContent) => {

    let key = useKey;
    let type = messageType;
    let content = { 'text' : messageContent };

    //console.log(redis.redis.get(key, (error, result) => { console.log(result); }));

    redis.redis.get(key).then((result) => {

        //TODO key 값이 있는 경우
        console.log(result);

    }).catch((result === nul) {

        //TODO key 값이 없는 경우
        console.log("catch in");
    });

    // var payload = {
    //
    //     workspace_id : config.conversationConfig.workspace_id,
    //     context : context || {},
    //     input : message || {}
    // }

    // var requestOptions = {
    //
    //     method : "GET",
    //     url :
    // }

}


ConversationService.preProcess = function(payload){

    var inputText = payload.input.text;
    console.log("User Input : " + inputText);
    console.log("Processed Input : " + inputText);
    console.log("--------------------------------------------------");

    return payload;
}


module.exports = ConversationService;
