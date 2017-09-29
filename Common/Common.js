var uuidv4 = require('uuid/v4');
var crypto = require("crypto");
var util = require('util');
var moment = require('moment');

var log = require('../Entity/Log.js');
var redis = require('../Service/RedisService.js');
var config = require('../Common/Config.js');

var Common = () => {};

/* EX) common.Encryption(description, 'aes-256-ctr') */

Common.Encryption = (description, algorithm) => {

    var cipher = crypto.createCipher(algorithm, config.serverConfig.auth_key);
    var encipherContent = cipher.update(description, 'utf8', 'hex');
    encipherContent += cipher.final('hex');
    return encipherContent;
}

/* EX) common.Decryption(description, 'aes-256-ctr') */

Common.Decryption = (description, algorithm) => {

    var decipher = crypto.createDecipher(algorithm, config.serverConfig.auth_key);
    var decipherContent = decipher.update(description, 'hex', 'utf8');
    decipherContent += decipher.final('utf8');
    return decipherContent;
}

/* EX) common.Hashing(description, 'ripemd160WithRSA') */

Common.Hashing = (description, algorithm) => {

    var hash = crypto.createHash(algorithm);
    var hashedContent = hash.update(config.serverConfig.auth_key+description);
    hashedContent = hash.digest('hex');
    return hashedContent;
}

Common.MemoryDataConvert = (callback) => {

    redis.stream.on('data', (logKey) => {

        for(let i = 0; i < logKey.length; i++){

            console.log("## FOR LOGIC & 1-CYCLE START ##");
            console.log(logKey[i]);
            console.log("## FOR LOGIC & 1-CYCLE END ##");

            redis.log.get(logKey[i]).then((result) => {

                console.log("## GET REDIS & 2-CYCLE START ##");
                console.log(logKey[i]);
                console.log("## GET REDIS & 2-CYCLE END ##");

                result = JSON.parse(result);
                log.create(result).then(() => {

                    console.log("## RDB INSERT & 3-CYCLE START ##");
                    console.log(logKey[i]);
                    console.log("## RDB INSERT & 3-CYCLE END ##");

                    redis.log.del(logKey[i]).then((result) => {

                        console.log("## DELETE REDIS & 4-CYCLE START ##");
                        console.log(logKey[i]);
                        console.log("## DELETE REDIS & 4-CYCLE END ##");

                    }).catch((error) => {

                        callback(JSON.stringify(error));
                    });

                }).catch((error) => {

                    callback(JSON.stringify(error));
                });
            });
        }
    });
}

Common.Eunsol = (callback) => {

    redis.stream.on('data', function(resultKeys) {

        console.log(resultKeys);

        for (var i = 0; i < resultKeys.length; i++) {

            console.log("## FOR START 111 ##");
            console.log(resultKeys[i]);
            console.log("## FOR END 111 ##");

            redis.log.get(resultKeys[i]).then((result) => {

                var jsonResult = JSON.parse(result);

                console.log("## GET REDIS DATA START 222 ##");
                console.log(resultKeys[i]);
                console.log("## GET REDIS DATA END 222 ##");

                log.create(jsonResult).then((result) => {

                    console.log("## RDB INSERT START 333 ##");
                    console.log(resultKeys[i]);
                    console.log("## RDB INSERT END 333 ##");

                    redis.log.del(resultKeys[i]).then((result) => {

                        console.log("## IN DELETE SUCCESS START 444 ##");
                        callback(resultKeys[i]);
                        console.log("## IN DELETE SUCCESS END 444 ##");

                    }).catch((error) => {

                        console.log("## IN DELETE FAIL START 444 ##");
                        console.log(error);
                        console.log("## IN DELETE FAIL END 444 ##");
                    });

                }).catch(function(err) {

                    callback(error);
                });
            });
        }
    });
}

Common.SetLogContent = (data, key) => {

    var logObject = {};
    var primaryKey;

    if(key) logObject.userId = key;
    if(data.hasOwnProperty("intent")) logObject.intent = data.intents[0].intent;
    if(data.hasOwnProperty("confidence")) logObject.confidence = data.intents[0].confidence;
    if(data.hasOwnProperty("entities")){

        for(let i = 0; i < data.entities.length; i ++){

            switch(i){

                case 0 :

                  logObject.entityLabelA = data.entities[0].entity;
                  logObject.entityValueA = data.entities[0].value;
                  break;

                case 1 :

                  logObject.entityLabelB = data.entities[1].entity;
                  logObject.entityValueB = data.entities[1].value;
                  break;

                case 2 :

                  logObject.entityLabelC = data.entities[2].entity;
                  logObject.entityValueC = data.entities[2].value;
                  break;
            }
        }
    }

    logObject.userMessage = data.input.text;
    logObject.botMessage = data.output.text[0];
    logObject.conversationId = data.context.conversation_id;
    if(data.output.nodes_visited[0]) logObject.nodeVisited = data.output.nodes_visited[0];
    if(data.output.nodes_visited[1]) logObject.nodeVisitedId = data.output.nodes_visited[1];
    if(data.context.ages) logObject.age = data.context.ages;
    if(data.context.name) logObject.name = data.context.name;
    if(data.output.log_messages[0]){

        logObject.logLevel = data.output.log_messages[0].level;
        logObject.logMessage = data.output.log_messages[0].msg;
    }
    if(data.context.system.dialog_turn_counter) logObject.dialogueCount = data.context.system.dialog_turn_counter;
    logObject.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");

    // console.log("## ERROR MESSAGE START ##");
    // console.log(data.output.log_messages[0]);
    // console.log("## ERROR MESSAGE END ##");

    //primaryKey = key + "-" + String(uuidv4());
    primaryKey = uuidv4();
    redis.log.set(primaryKey, JSON.stringify(logObject)).then().catch((error) => {

        console.log(JSON.stringify(error));
    });
}

Common.SetMessage = (data) => {

    // console.log("#### CURRENT NODE START ####");
    // console.log(data.context);
    // console.log("#### CURRENT NODE END ####");

    let resultMessage = {};

    if(data == "unknown_api_error"){

        resultMessage = {

            "message" : {
                "text" : "알 수 없는 에러가 발생함🙊"
            }
        }

        return resultMessage;
    }

    switch(data.context.current_node)
    {
        case "0_4" :
        case "1_3" :
        case "2_3" :
        case "3_3" :
          var text = data.output.text[0];

          resultMessage =
            {
              "message": {
                "text": text
              },
              "keyboard": {
                "type": "buttons",
                "buttons": [
                    "빼로빼로얍"
                  ]
              }
            };
          return resultMessage;

        case "1_0" :
          var text = data.output.text[0];
          resultMessage =
            {
              "message": {
                "text": text
              },
              "keyboard": {
                "type": "buttons",
                "buttons": [
                     "액션", "애니", "로맨틱", "sf", "스릴러", "판타지", "공포", "코미디"
                ]
              }
            };
          return resultMessage;

        case "2_0" :
          var text = data.output.text[0];
          resultMessage =
            {
              "message": {
                "text": text
              },
              "keyboard": {
                "type": "buttons",
                "buttons": [
                     "[서울스카이] 123층의 전망대","[아쿠아리움] 예쁜 물고기 가득","[쇼핑] 없는 브랜드가 없어!"
                ]
             }
          };
          return resultMessage;

        case "3_2" :
          var text = data.output.text[0];
          resultMessage =
          {
            "message": {
              "text": text
            },
            "keyboard": {
              "type": "buttons",
              "buttons": [
                  "편의점","슈퍼", "마트"
              ]
            }
          };
          return resultMessage;

        case "choice":
          var text = data.output.text[0];
          text +="\n\n" ;
          if(data.output.text.length > 1){
              text += data.output.text[1];
          }
          resultMessage =
          {
            "message": {
              "text": text
            },
            "keyboard": {
              "type": "buttons",
              "buttons": [
                  "이성(전연령)",
                  "월드타워(20대↑)",
                  "한강(20대↑)",
                  "휴가(30대↑)"
              ]
            }
          };
          return resultMessage;

        case "neverBeen_worldtower" :
          var url = "https://c1.staticflickr.com/4/3741/33234069096_7aee8a632b_b.jpg";
          var text = data.output.text[0];

          resultMessage =
          {
              "message":{
                  "text" : text,
                  "photo": {
                    "url": url,
                    "width": 640,
                    "height": 320
                  }
              }
          };
          return resultMessage;

        case "neverBeen_hanriver" :
          var url = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Typical_evening_in_Han_river_park_Seoul.jpg/640px-Typical_evening_in_Han_river_park_Seoul.jpg";
          var text = data.output.text[0];

          resultMessage =
          {
            "message":{
                "text" : text,
                "photo": {
                  "url": url,
                  "width": 320,
                  "height": 320
                }
            }
          };
          return resultMessage;

        case "sweethome" :
          var text = data.output.text[0];
          var url = "http://www.futurekorea.co.kr/news/photo/201611/33524_25979_2430.jpg";
          resultMessage =
          {
              "message":{
                  "text" : text,
                  "photo": {
                    "url": url,
                    "width": 320,
                    "height": 320
                  }

              },
            "keyboard": {
              "type": "buttons",
              "buttons": [
                   "빼로빼로얍"
              ]
            }
          };
          return resultMessage;

        case "info1" :
          var text = data.output.text[0];
          resultMessage =
          {
              "message":{
                  "text" : text
              },
            "keyboard": {
              "type": "buttons",
              "buttons": [
                   "헐 몰랐어😉",
                   "빼빼로 맛있어",
                   "1은 넘 말랐어!"

              ]
            }
          };
          return resultMessage;

        case "info2" :
          var text = data.output.text[0];
          var url = "http://www.newsworks.co.kr/news/photo/201610/87896_18834_841.jpg";
          resultMessage =
          {
              "message":{
                  "text" : text,
                  "photo": {
                    "url": url,
                    "width": 320,
                    "height": 320
                  }
              },
            "keyboard": {
              "type": "buttons",
              "buttons": [
                   "빼빼로 칭찬해~~",
                   "26억 바큌ㅋㅋㅋ 대박👍",
                   "내가 먹은게 지구 한바퀴 정도될듯"
              ]
            }
          };
          return resultMessage;

        case "sat" :
          var text = data.output.text[0];
          text += "\n\n올해는 빼빼로데이가 토요일인거 알고 있지?(감동)\n\n소중한 사람들에게 마음을 전달하는 것 잊지 말기~(제발)";
          var url = "http://www.lotteconf.co.kr/";

          text += "\n\n빼로가 추천한 빼빼로와 함께 좋은시간 보내~(하트)\n";

          resultMessage =
          {
            "message": {
              "text": text,
              "message_button": {
                "label": "마음을 전하세요😘",
                "url": url
              }
            },
            "keyboard": {
              "type": "buttons",
              "buttons": [
                "토요일이라도 잊지않을게😘"
              ]
            }
          };
          return resultMessage;

        case "evaluation" :
          var eval_node = data.context.eval_node
              case 1:
                var wcstext = data.output.text[0];
                if (data.output.text.length > 1){
                  wcstext += "\n";
                  wcstext += data.output.text[1];

                }
                var result = wcstext;
                resultMessage = {
                "message":{
                  "text" : result,
                  "context" : data.output.context    }
                };
                return resultMessage;

              case 2:
                var text = data.output.text[0];
                  resultMessage =
                  {
                    "message": {
                      "text": text,
                    },
                    "keyboard": {
                      "type": "buttons",
                      "buttons": [
                        "별 세 개 ⭐️⭐️⭐️",
                        "별 두 개 ⭐️⭐️",
                        "별 한 개 ⭐️"
                        ]
                    }
                  };
                  return resultMessage;

        case "gag1" :
          var text = data.output.text[0];
          var n = data.context.gagscene;
          switch(n){
              case 0:
                  text += "\n반성문을 영어로 하면?(제발)";
                  break;
              case 1:
                 text += "\n겨울에 인기있는 끈은?(제발)";
                 break;
              case 2:
                  text += "\n맥주가 죽기전에 남긴 말은?(제발)";
                  break;
              case 3:
                  text += "\n푸가 높은곳에서 떨어지면?(제발)";
                  break;
              case 4:
                 text += "\n우유가 넘어지면?(제발)";
                 break;
              case 5:
                text += "\n소나무가 삐지면?(제발)";
                break;
              case 6:
                 text += "\n세상에서 가장 야한 음식은?(제발)";
                 break;
              case 7:
                 text += "\n세상에서 가장 지루한 중학교는?(제발)";
                 break;
              case 8:
                 text += "\n'초콜릿이 달다'를 4글자로 말하면?(제발)";
          }
          resultMessage =
          {
            "message": {
              "text": text
            }
          };
          return resultMessage;

        case "gag2" :
          var n = data.context.gagscene;
          switch(n){
              case 0:
                  var text = "정답은... 두구두구두구[글로벌]이야(굿)\n글로 벌받아(부끄)\n\n";
                  break;
              case 1:
                  var text = "정답은... 두구두구두구[따끈따끈]이야(굿)\n뜨끈뜨끈도 정답으로 인정!ㅋㅋ(미소)\n\n";
                  break;
              case 2:
                  var text = "맥주가 유언을 남겼거든...?\n정답은... 두구두구두구[유언비어](굿)\n\n";
                  break;
              case 3:
                  var text = "쿵해떠 푸😵\n정답은... 두구두구두구[쿵푸](굿)\n\n";
                  break;
              case 4:
                  var text = "우유가 ↙이쪽으로 넘어지면... \n정답은... [아야](굿)\n\n";
                  break;
              case 5:
                  var text = "칫!ᕙ(•̀‸•́‶)ᕗ  정답은...[칫솔]이야(굿)\n\n";
                  break;
              case 6:
                  var text = "🍄 빨개.. 버섯....[버섯](굿)\n\n";
                  break;
              case 7:
                  var text = "....99.9% 정답은... 두구두구두구[로딩중](굿)\n\n";
                  break;
              case 8:
                  var text = "\n정답은 [가나다라]!! 가나는 달지(부끄)\n\n";
          }
          text += data.output.text[0];
          resultMessage =
          {
              "message":{
                  "text" : text,
              },
               "keyboard": {
              "type": "buttons",
              "buttons": [
                "아재스타일 빼로를 용서하기", "ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ","아재 빼로를 용서하지 않기"
              ]
            }
          };
          return resultMessage;

          case "reco":
            var recommended = data.context.recommended;
            switch(recommended){
                case "아몬드":
                    var url = "http://postfiles9.naver.net/MjAxNzA3MTdfMjE0/MDAxNTAwMjY1MzI5NDM3.NUhz_mBmkf1toQufupv5QvlqJATcuPC_2Du0MqJXE6kg.Kq8QB6P-60uHnH4iIBEtqC3aWUiyj-gHx4vFnviYnQ8g.JPEG.hy920325/1200_%EC%95%84%EB%AA%AC%EB%93%9C.jpg?type=w966";
                    break;
                case "오리지널":
                    var url = "http://postfiles16.naver.net/MjAxNzA3MTdfOTYg/MDAxNTAwMjY1MzI4NTQz.joHMdO6HbNbLH9rhFZrYj_2MzcSM8qV19gfQ4OB04w0g.X-8XPq2Zfmu_wnCyONZqbSAshHWldM8q2TzG5NGAjGMg.JPEG.hy920325/1200_%EC%98%A4%EB%A6%AC%EC%A7%80%EB%82%A0.jpg?type=w966";
                    break;
                case "누드":
                    var url = "http://postfiles11.naver.net/MjAxNzA3MTdfMjE0/MDAxNTAwMjY1MzI4MjQ5.ZQc0rQAJcn3W01R3sLgAl1PZPaDNwvaZGaCl9fsBVu8g.ZU6z3dE-8ZsqQWMKoDfjCkOpBoXpQfH2IlkNnP6qqMcg.JPEG.hy920325/%EB%88%84%EB%93%9C.jpg?type=w966";
                    break;
                case "누드치즈":
                    var url ="http://postfiles10.naver.net/MjAxNzA3MTdfMTA2/MDAxNTAwMjY1ODY5Mzc2.00g59n-Y6yuLFNo2S3YseeF5i7sXwEzVBErh-Qba35Eg.FUtOHI4Pk5u1x4jFo1HqqWbtigoIeRsQp6t_wInUkqsg.JPEG.hy920325/%EB%88%84%EB%93%9C%EC%B9%98%EC%A6%88.jpg?type=w966";
                    break;
                case "카페라떼":
                    var url = "http://postfiles10.naver.net/MjAxNzA3MTdfMjUw/MDAxNTAwMjY1MzQyMDcx.W0E-yomdjsdPR9M0gNwuwj3SjrfoEU-8CkEPyEA55rkg.I0eLUtjMmX4VYE1RUgAj4DD028CGv_hjL__xNTOMlREg.JPEG.hy920325/%EB%8D%94%EB%B8%94%EB%94%A5%EC%B9%B4%ED%8E%98%EB%9D%BC%EB%96%BC.jpg?type=w966";
                    break;
                case "스키니카카오":
                    var url = "http://postfiles7.naver.net/MjAxNzA3MTdfMTM4/MDAxNTAwMjY1MzQxMzcz.875LjFcUOQgf0Su-nZyDjQlJuv_0l_VtZABVa0gCtGMg.4QKPUFF9QYuwtBZVwdZXn09XcDRU7omhiLk1sM-Rsl8g.JPEG.hy920325/%EC%8A%A4%ED%82%A4%EB%8B%88%EC%B9%B4%EC%B9%B4%EC%98%A4.jpg?type=w966";
                    break;
                case "바닐라블랙":
                    var url = "http://blog.naver.com/PostList.nhn?blogId=hy920325&widgetTypeCall=true&topReferer=https%3A%2F%2Fwww.naver.com%2F#";
                    break;
                case "화이트쿠키":
                var url = "http://postfiles14.naver.net/MjAxNzA3MTdfMTIw/MDAxNTAwMjY1MzQzNDA0.BNZveDRbzbKLa_bMRMOaLP05nI-09OkcwXf4f13PZjAg.NkgyxO6IBSxAETROaFLZVPz-9yASaIMSparXEoNec5gg.JPEG.hy920325/%ED%99%94%EC%9D%B4%ED%8A%B8%EC%BF%A0%ED%82%A4.jpg?type=w966";
                    break;
                case "카카오닙스":
                    var url = "https://cdn.pixabay.com/photo/2016/07/20/07/06/cocoa-1529746_960_720.jpg";
                    break;
                case "요구르트":
                    var url = "http://postfiles9.naver.net/MjAxNzA3MTdfMjUx/MDAxNTAwMjY1ODY5NTk4.hz-XRoyHuw0MCnxIp7AqaAcJH-rvWssIP0-gC_7LC9Qg.RbjLtE7pIv4rLTUfIWOWe5HLbkGGJJeH6I3MznQJxGAg.JPEG.hy920325/%EB%8D%94%EB%B8%94%EB%94%A5_%EB%B9%BC%EB%B9%BC%EB%A1%9C_%EC%9A%94%EA%B5%AC%EB%A5%B4%ED%8A%B8_%EC%8B%9C%EB%AE%AC.jpg?type=w966";
                    break;
                case "누드녹차":
                    var url = "http://postfiles11.naver.net/MjAxNzA3MTdfNyAg/MDAxNTAwMjY1MzMxMjY1.lRBcJeQnLUsX1646OUkQA4AIn4Oke00gOcb22xvYA38g.aWMxBOxxnlk3YPW_08YlnFozgI7nxz-r-NwhrnKk0a8g.JPEG.hy920325/%EB%88%84%EB%93%9C%EB%85%B9%EC%B0%A8.jpg?type=w966";
                    break;
                case "코코넛":
                    var url = "http://postfiles3.naver.net/MjAxNzA3MTdfMjgx/MDAxNTAwMjY1MzQzNjY0.2nbE4S-ly5kG9oI533vcRONfAAdz_bnAnk2yQ_StMx8g.L9atJb1pLYgsOPeU7XAywNBfqiHR_U4N-OywCsNPdGcg.JPEG.hy920325/%EC%BD%94%EC%BD%94%EB%84%9B.jpg?type=w966";
                    break;
            }

            var text = "인공지능으로 추천하는 빼빼로는 바로..!(좋아)\n\n";
            text += data.output.text[0];
            text += "\n\n내 추천.. 어땠어?\n";

            resultMessage =
            {
              "message": {
                "text": text,
                "photo": {
                  "url": url,
                  "width": 640,
                  "height": 480
                },
              },
              "keyboard": {
                "type": "buttons",
                "buttons": [
                    "엄지척척👍👍",
                    "엄지척👍",
                    "별 하나도 아까워!",
                    "처음으로"
                ]
              }
            };

            return resultMessage;

        default :
          var wcstext = data.output.text[0];
          if (data.output.text.length > 1){

              wcstext += "\n";
              wcstext += data.output.text[1];
          }
          var result = wcstext;
          resultMessage =
          {
              "message":{
                  "text" : result,
                  "context" : data.output.context    }
          };

          return resultMessage;
    }
}

module.exports = Common;
