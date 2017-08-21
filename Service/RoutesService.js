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

    /* 브라우저 값 출력 테스트용 START */
    app.get('/', (req, res, callback) => {

	      var result = "result";

        res.status(200).json({ "result" : result });
    });
    /* 테스트용 END */

    app.use('/kakao', kakaoController);

    console.log("## setup routes ##");
}

module.exports = RoutesService;
