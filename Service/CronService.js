var redis = require('../Service/RedisService.js');
var exceptionCollection = require('./CronServiceException.js');
var log = require('../Entity/Log.js');
var moment = require('moment');

//data : return file part
redis.stream.on('data', function(resultKeys) {
  //console.log("resultKeys length : " + resultKeys.length);

  console.log("[START TIME STAMP] "+moment().format("YYYY-MM-DD HH:mm:ss"));

  //desc : data length check
  if (!exceptionCollection.redisDataLengthCheck(resultKeys.length)){

      console.log("[END TIME STAMP] "+moment().format("YYYY-MM-DD HH:mm:ss")+"\n");
      process.exit();
  }

  for (let i = 0; i < resultKeys.length; i++) {

      // des : get data from redis
      redis.log.get(resultKeys[i]).then(function(result) {


          var jsonResult = JSON.parse(result);

          console.log("## GET REDIS DATA START ##");
          console.log(jsonResult);
          console.log("## GET REDIS DATA END ##");

          //des : maridadb insert
          log.create(jsonResult).then(function(result) {

              console.log("## INSERT DATA RESULT START ##");
              console.log(jsonResult);
              console.log("## INSERT DATA RESULT END ##");

              redis.log.del(resultKeys[i]).then(() => {

                  if(i == (resultKeys.length-1)){

                      console.log("[END TIME STAMP] "+moment().format("YYYY-MM-DD HH:mm:ss")+"\n");
                      process.exit();
                  }

              }).catch((error) => {

                    if(i == (resultKeys.length-1)){

                        console.log(JSON.stringfy(error));
                        console.log("[END TIME STAMP] "+moment().format("YYYY-MM-DD HH:mm:ss")+"\n");
                        process.exit();
                    }else{
                        console.log(JSON.stringfy(error));
                        console.log("[ERROR TIME STAMP] "+moment().format("YYYY-MM-DD HH:mm:ss")+"\n");
                    }
              });
          }).catch(function(err) {

              var error = err.toString();
              //des : error
              if (!exceptionCollection.errorHandlingFunc(error)){

                if(i == (resultKeys.length-1)){

                    console.log(error);
                    console.log("[END TIME STAMP] "+moment().format("YYYY-MM-DD HH:mm:ss")+"\n");
                    process.exit();
                }else{
                    console.log(error);
                    console.log("[ERROR TIME STAMP] "+moment().format("YYYY-MM-DD HH:mm:ss")+"\n");
                }
              }
          });
      });
  }
});
