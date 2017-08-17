'use strict';

var Conversation = require('watson-developer-cloud/conversation/v1');

var config = require('../Common/Config.js');
var redis = require('../Service/RedisService.js');

var ConversationService = function(){};

ConversationService.Init = function(){

      global.conversation = new Conversation(config.conversationConfig.conversation);
}

ConversationService.GetConversationResponse = (userKey, messageType, messageContent, callback) => {

    let key = userKey;
    let type = messageType;
    let content = { 'text' : messageContent };
    let context = {};
    let result;

    redis.redis.get(key).then((result) => {

          if(result != null){

              context = JSON.parse(result);
          }

          let payload = {

              workspace_id : config.conversationConfig.workspace_id,
              context : context,
              input : content || {}
          }

          var data = conversation.message(payload, (error, data) => {

              if(error) throw error;
              else{
                  redis.redis.set(key, JSON.stringify(data.context), () => {

                      callback(data);
                  });
              }
          });

    }).catch((error) => {

          throw error;
    });
}

module.exports = ConversationService;
