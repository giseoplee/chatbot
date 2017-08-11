var util = require('util');
var express = require('express');

var router = express.Router();

router.use(function log(req, res, next) {

    res.header('Content-Type', 'application/json; charset=utf-8');
    console.log('## [TEST] KakaoController started ##');
    next();
});

router.get('/keyboard', function(req, res, callback){

    console.log("in keyboard url");
    res.json({ "type" : "text" });
    //TODO KAKAO API LOGIC
});

router.post('/message', function(req, res, callback){

    console.log("in keyboard url");
    res.json(
        {
          "message" : { "text" : "밥 뭐묵지" }
        }
    );
    //TODO KAKAO API LOGIC
});

module.exports = router;
