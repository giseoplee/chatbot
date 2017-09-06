"use strict"

var ioRedis = require('ioredis');
var util = require('util');
var config = require('../Common/Config.js');

var RedisService = () => {};

var contextCache = new ioRedis(
{
      port: config.redisConfig.redisPort,
      host: config.redisConfig.redisHost,
      password: config.redisConfig.redisPassword,
      db: 0,

      retryStrategy: (times) => {
          var delay = Math.min(times * 4, 4000);
          return delay;
      }
});

var logCache = new ioRedis(
{
    port: config.redisConfig.redisPort,
    host: config.redisConfig.redisHost,
    password: config.redisConfig.redisPassword,
    db: 1,

    retryStrategy: (times) => {
        var delay = Math.min(times * 4, 4000);
        return delay;
    }
});

RedisService.context = contextCache;
RedisService.log = logCache;
RedisService.stream = logCache.scanStream({ count : 1 });

module.exports = RedisService;
