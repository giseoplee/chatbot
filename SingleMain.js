"use strict"

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var util = require('util');
var methodOverride = require('method-override');
var http = require('http');
var process = require('process');

var config = require('./Common/Config.js');
var redisService = require('./Service/RedisService.js');
var routesService = require('./Service/RoutesService.js');
var entityService = require('./Service/EntityService.js');
var conversationService = require('./Service/ConversationService.js');

global.app = new express();

app.set('port', process.env.PORT || config.serverConfig.port);

app.use(compression());
app.use(cookieParser(config.serverConfig.cookie_secret));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.set('trust proxy', config.serverConfig.trust_proxy_host);

entityService.Init();
redisService.Init();
routesService.Init();
conversationService.Init();

http.createServer(app).listen(app.get('port'), () => {
    console.log(util.format('## [processRun] [pid:%d] Server running at %d ##', process.pid, config.serverConfig.port));
});
