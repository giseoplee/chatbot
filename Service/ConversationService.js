'use strict';

var Conversation = require('watson-developer-cloud/conversation/v1');

var config = require('../Common/Config.js');
var redis = require('../Service/RedisService.js');

var ConversationService = function(){};

ConversationService.Init = function(){

      global.conversation = new Conversation(config.conversationConfig.conversation);

      //onsole.log(redis.redis.set("key" , "value"));
      //console.log(redis);
      // redis.redis.set("key", "value");
      // redis.redis.get("key", (err, result) => { console.log(result); });

      redis.redis.set("key", "value");
      ConversationService.SendMessage("key", "text", "hello");
}

// var sendMessage = new Promise((resolve, reject) =>
//     conversation.message(payload, function(err, data) {
//       if (err) {
//         reject(err);
//       }else{
//         resolve(data);
//       }
//     })
// );

ConversationService.SendMessage = (useKey, messageType, messageContent) => {

    let key = useKey;
    let type = messageType;
    let content = { 'text' : messageContent };

    // let payload = {
    //
    //   workspace_id : config.conversationConfig.workspace_id,
    // }

    //console.log(redis.redis.get(key, (error, result) => { console.log(result); }));

    redis.redis.get(key).then((result) => {

        ConversationService.getConversationResponse({}, content);
    });
}

ConversationService.getConversationResponse = function(context, message){

    let payload = {

        workspace_id : config.conversationConfig.workspace_id,
        context : context || {},
        input : message || {}
    }

    var sendMessage = new Promise( (resolve, reject) => {

        conversation.message(payload, (error, data) => {

            if (error) {

              reject(error);

            }else{

              resolve(data);
            }
        });
    });

    sendMessage.then(response => {

        //console.log(response);
        //console.log(response.output);
        // console.log(response.output.log_messages);
        var output = response.output.text[0]; // output.text는 배열
        var new_context = response.context; // wcs 응답 context
        var message = { "message" : { "text" : output } }

    })
    .catch(error => {

        console.log(error);
    });
}

module.exports = ConversationService;
