var redis = require('../Service/RedisService.js');
var exceptionCollection = require('./CronServiceException.js');
var log = require('../Entity/Log.js');

//data : return file part
redis.stream.on('data', function(resultKeys) {
  //console.log("resultKeys length : " + resultKeys.length);

  //desc : data length check
  if (!exceptionCollection.redisDataLengthCheck(resultKeys.length)) return;

  for (let i = 0; i < resultKeys.length; i++) {

    // des : get data from redis
    redis.log.get(resultKeys[i]).then(function(result) {

        var jsonResult = JSON.parse(result);

        //ERROR : primaryKey in null
        if (!exceptionCollection.primarykeyCheck(jsonResult)) return;
        //des : maridadb insert
        log.create(jsonResult).then(function(result) {

            redis.log.del(resultKeys[i]).then().catch((error) => {

                callback(error);
            });
        }).catch(function(err) {

            var error = err.toString();
            //des : error
            if (!exceptionCollection.errorHandlingFunc(error)) return;
        });
    });
  };
});
