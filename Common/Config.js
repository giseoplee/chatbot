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

var _serverConfigRaw = fs.readFileSync(_serverConfigDir, 'ascii');
var _serverConfig = JSON.parse(_serverConfigRaw);

var _storeConfigRaw = fs.readFileSync(_storeConfigDir, 'ascii');
var _storeConfig = JSON.parse(_storeConfigRaw);

var _redisConfigRaw = fs.readFileSync(_redisConfigDir, 'ascii');
var _redisConfig = JSON.parse(_redisConfigRaw);

var _conversationConfigRaw = fs.readFileSync(_conversationConfigDir, 'ascii');
var _conversationConfig = JSON.parse(_conversationConfigRaw);

exports.serverConfig = _serverConfig;
exports.storeConfig = _storeConfig;
exports.redisConfig = _redisConfig;
exports.conversationConfig = _conversationConfig;
