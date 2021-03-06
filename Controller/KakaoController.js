var util = require('util');
var express = require('express');

var conversationService = require('../Service/ConversationService.js');
var dummyService = require('../Service/DummyConversationService.js');
var common = require('../Common/Common.js');
var router = express.Router();

router.use((req, res, next) => {

    res.header('Content-Type', 'application/json; charset=utf-8');
    next();
});

router.get('/keyboard', (req, res, callback) => {

    res.json({ "type" : "buttons", "buttons" : ["대화하기"] });
});

router.post('/message', (req, res, callback) => {

    // console.log("#### KAKAO PARAMETER START ####");
    // console.log(req.body);
    // console.log("#### KAKAO PARAMETER END ####");
    let key = req.body.user_key;
    let type = req.body.type;
    let content = req.body.content;

    try {
        conversationService.GetConversationResponse(key, type, content, (data, error) => {

            // console.log("#### WCS RESPONSE START ####");
            // console.log(data);
            // console.log("#### WCS RESPONSE END ####");
    
            if(error) throw error;
            let message = common.SetMessage(data);
    
            // console.log("#### SET MESSAGE RESPONSE START ####");
            // console.log(message);
            // console.log("#### SET MESSAGE RESPONSE END ####");
    
            res.send(message);
        });
    } catch (error) {
        throw error;
    }
});

router.post('/message/dummy/test', (req, res, callback) => {

    // console.log("#### PARAMETER START ####");
    // console.log(req.body);
    // console.log("#### PARAMETER END ####");

    dummyService.GetConversationResponse((data, error) => {

        // console.log("#### DUMMY WCS RESPONSE START ####");
        // console.log(data);
        // console.log("#### DUMMY WCS RESPONSE END ####");

        if(error) throw error;
        var message = common.SetMessage(data);

        // console.log("#### SET MESSAGE RESPONSE START ####");
        // console.log(message);
        // console.log("#### SET MESSAGE RESPONSE END ####");

        res.send(message);
    });
});

/**

redis > RDB 컨버팅 테스트용 로직

router.get('/memory', (req, res, callback) => {

    res.send(common.Eunsol(callback));
});

*/

module.exports = router;
