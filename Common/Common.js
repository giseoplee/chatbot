var uuid = require('node-uuid');
var crypto = require("crypto");
var util = require('util');

var config = require('../Common/Config.js');

var Common = function(){};

/* freemed 소문자 -> sha512 해시 = auth_key  */

Common.Encryption = function(description, algorithm){

    var cipher = crypto.createCipher(algorithm, config.serverConfig.auth_key);
    var encipherContent = cipher.update(description, 'utf8', 'hex');
    encipherContent += cipher.final('hex');
    return encipherContent;
}

/* EX) common.Encryption(description, 'aes-256-ctr') */

Common.Decryption = function(description, algorithm){

    var decipher = crypto.createDecipher(algorithm, config.serverConfig.auth_key);
    var decipherContent = decipher.update(description, 'hex', 'utf8');
    decipherContent += decipher.final('utf8');
    return decipherContent;
}

/* EX) common.Decryption(description, 'aes-256-ctr') */

Common.Hashing = function(description, algorithm){

    var hash = crypto.createHash(algorithm);
    var hashedContent = hash.update(config.serverConfig.auth_key+description);
    hashedContent = hash.digest('hex');
    return hashedContent;
}

/* EX) common.Hashing(description, 'ripemd160WithRSA') */

Common.SetMessage = (data) => {

    console.log(data.context.current_node);

    let resultMessage = {};

    switch(data.context.current_node)
    {
        case "0_4", "1_3", "2_3", "3_3":
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
