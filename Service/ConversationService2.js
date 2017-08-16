'use strict';

var Conversation = require('watson-developer-cloud/conversation/v1');

var config = require('../Common/Config.js');
var redis = require('../Service/RedisService.js');

var ConversationService = function(){};

ConversationService.Init = function(){

      global.conversation = new Conversation(config.conversationConfig.conversation);
}

ConversationService.SendMessage = (userKey, messageType, messageContent) => {

    let key = userKey;
    //let type = messageType;
    let type = "text"
    let content = { 'text' : messageContent };

    ConversationService.getConversationResponse({}, content);

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

        var output = response.output.text[0]; // output.text는 배열
        var new_context = response.context; // wcs 응답 context
        var message = { "message" : { "text" : output } }

        return message;
    })
    .catch(error => {

        console.log(error);
        return error;
    });
}

module.exports = ConversationService;
