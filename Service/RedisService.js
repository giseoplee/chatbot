var ioRedis = require('ioredis');
var util = require('util');
var config = require('../Common/Config.js');

var RedisService = () => {};

RedisService.Init = (workerId) => {

    this.contextCache = new ioRedis(
    {
        port: config.redisConfig.redisPort,
        host: config.redisConfig.redisHost,
        password: config.redisConfig.redisPassword,
        db: 0,

        retryStrategy: (times) => {
            var delay = Math.min(times * 2, 2000);
            console.log(delay);
            return delay;
        }
    });

    this.logCache = new ioRedis(
    {
        port: config.redisConfig.redisPort,
        host: config.redisConfig.redisHost,
        password: config.redisConfig.redisPassword,
        db: 1,

        retryStrategy: (times) => {
            var delay = Math.min(times * 2, 2000);
            console.log(delay);
            return delay;
        }
    });

    if(workerId) console.log(util.format("## [%d worker] redis started ##", workerId));
    else console.log("## redis service started ##");
}

module.exports = RedisService;
