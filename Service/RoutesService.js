var csurf = require('csurf');
var util = require('util');

var config = require('../Common/Config.js');
var kakaoController = require('../Controller/KakaoController.js');

var csrfProtection = new csurf({ cookie: true });

var RoutesService = function(){};

RoutesService.Init = function(){

    if (app.get('env') === 'production'){

        app.use(csrfProtection);
        console.log(util.format('Use Middleware csrf'));
    }

    app.use(function log(req, res, next){

        res.header('Access-Control-Allow-Origin', config.serverConfig.accept_domain);
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        console.log(util.format("## URL : %s / IP : %s ##", req.originalUrl, req.ip));
        next();
    });

    app.get('/', (req, res, callback) => {
      
	      var result = "result";
        res.status(200).json({ "result" : result });
    });

    app.use('/kakao', kakaoController);

    console.log("## setup routes ##");
}

module.exports = RoutesService;
