var fs = require("fs");

// var _serverConfigDir = "/home/ubuntu/chatbot/Config/server.conf";
// var _storeConfigDir = "/home/ubuntu/chatbot/Config/store.conf";
// var _redisConfigDir = "/home/ubuntu/chatbot/Config/redis.conf";
// var _conversationConfigDir = "/home/ubuntu/chatbot/Config/conversation.conf";
// var _serverConfigDir = "C:/Users/LDCC/Desktop/제과챗봇/Chatbot/Config/server.conf";
// var _storeConfigDir = "C:/Users/LDCC/Desktop/제과챗봇/Chatbot/Config/store.conf";
// var _redisConfigDir = "C:/Users/LDCC/Desktop/제과챗봇/Chatbot/Config/redis.conf";
// var _conversationConfigDir = "C:/Users/LDCC/Desktop/제과챗봇/Chatbot/Config/conversation.conf";
var _serverConfigDir = "./Config/server.conf";
var _storeConfigDir = "./Config/store.conf";
var _redisConfigDir = "./Config/redis.conf";
var _conversationConfigDir = "./Config/conversation.conf";

var _serverConfigRaw = fs.readFileSync(_serverConfigDir, "ascii");
var _serverConfig = JSON.parse(_serverConfigRaw);

var _storeConfigRaw = fs.readFileSync(_storeConfigDir, "ascii");
var _storeConfig = JSON.parse(_storeConfigRaw);

var _redisConfigRaw = fs.readFileSync(_redisConfigDir, "ascii");
var _redisConfig = JSON.parse(_redisConfigRaw);

var _conversationConfigRaw = fs.readFileSync(_conversationConfigDir, "ascii");
var _conversationConfig = JSON.parse(_conversationConfigRaw);

exports.serverConfig = _serverConfig;
exports.storeConfig = _storeConfig;
exports.redisConfig = _redisConfig;
exports.conversationConfig = _conversationConfig;

module.exports.dummyMessageType = "text";
module.exports.dummyInputContent = { "text" : "대화하기" };
module.exports.dummyUserKey = "DUMMY20171111EXO";
module.exports.dummyData = {

  "intents" : [ { "intent" : "욕설", "confidence" : 0.361053740978241 } ],
  "entities" : [ { "entity" : "치킨", "value" : "후라이드", "confidence" : 1 } ],
  "input" : { "text" : "후라이드" },
  "output" :
   { "text" : [ "역시 바삭한 후라이드가 최고지!(굿)\n(그만)잠깐(그만)\n치킨 먹는데 분위기 좀 UP 시켜보자!\n\n[아재력테스트]" ],
     "nodes_visited" : [ "1.4 치킨_인지" ],
     "log_messages" : [] },
  "context" :
    {
       "conversation_id" : "39aee8fa-d879-4366-b189-8486ba65dc02",
       "system" : {
         "dialog_stack" : [
           {
             "dialog_node" : "1.4 치킨_인지"
           }
         ],
         "dialog_turn_counter" : 8,
         "dialog_request_counter" : 8,
         "_node_output_map" : {
           "node_6_1497943866563" : [0],
           "node_11_1500440982570" : [0],
           "node_2_1499819770738" : [0],
           "0.3 - TEST시나리오 선택" : [0],
           "1.0 - 한강" : [0,1,0],
           "node_15_1498640776239" : [0],
           "node_23_1498695419036" : [0],
           "node_22_1498701230225" : [0],
           "node_18_1499928660291" : [0,0,1,2]
         }
       },
       "time": "2017-09-07 01:49:05",
       "repeat": 0,
       "second": "05",
       "gagscene": 5,
       "current_node": "gag1",
       "name": "더미데이터",
       "input_length": 5,
       "ages": "꽃청년",
       "0_1": "캠핑",
       "0_2": "찍먹",
       "0_3": null,
       "0_array": [
         "캠핑",
         "찍먹"
       ],
       "luckyGuy": "우정하는 친구님",
       "expires": 1504752623423
   }
};
