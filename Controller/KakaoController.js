var util = require('util');
var express = require('express');

var conversationService = require('../Service/ConversationService.js');
var common = require('../Common/Common.js');
var router = express.Router();

router.use(function log(req, res, next) {

    res.header('Content-Type', 'application/json; charset=utf-8');
    next();
});

router.get('/keyboard', function(req, res, callback){

    res.json({ "type" : "buttons", "buttons" : ["대화하기"] });
});

router.post('/message', function(req, res, callback){

    console.log(req.body);

    let key = req.body.user_key;
    let type = req.body.type;
    let content = req.body.content;

    conversationService.GetConversationResponse(key, type, content, (data, error) => {

        if(error) throw error;
        let message = common.SetMessage(data);
        res.send(message);
    });
});

module.exports = router;
