var util = require('util');

var config = require('../Common/Config.js');
var kakaoController = require('../Controller/KakaoController.js');

var RoutesService = () => {};

RoutesService.Init = () => {

    app.use((req, res, next) => {

        res.header('Access-Control-Allow-Methods', 'GET, POST');
        console.log(util.format("## URL : %s / IP : %s ##", req.originalUrl, req.ip));
        next();
    });

    app.use('/kakao', kakaoController);
    console.log("## setup routes ##");
}

module.exports = RoutesService;
