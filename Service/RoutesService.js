var util = require('util');
var moment = require('moment');

var config = require('../Common/Config.js');
var kakaoController = require('../Controller/KakaoController.js');

var RoutesService = () => {};

RoutesService.Init = () => {

    app.use((req, res, next) => {

        res.header('Access-Control-Allow-Methods', 'GET, POST');
        console.log(util.format("## URL : %s / IP : %s ##", req.originalUrl, req.ip));
        next();
    });

    app.get('/', (req, res, callback) => {

        var startTime = moment().valueOf();
        var obj = {};
        var endTime;

        setTimeout(() => {

          endTime = moment().valueOf();
          obj.startTime = startTime;
          obj.endTime = endTime;
          obj.distance = endTime - startTime;

          res.send(obj);

        },3000);
    });

    app.use('/kakao', kakaoController);
    console.log("## setup routes ##");
}

module.exports = RoutesService;
