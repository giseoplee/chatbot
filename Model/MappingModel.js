/* RDB에 로깅하는 부분 */

var redisService = require('../Service/SequelizeService.js');


var MappingModel = function(data){
    this.data = data;
}

module.exports = MappingModel;
