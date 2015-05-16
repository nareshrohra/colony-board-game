var fs = require('fs');
var Util = require('./Util');
var Config = require('./Config');

exports.log = function(msg){
	if(Config.DebugMode){
		console.log(msg);
	}
}