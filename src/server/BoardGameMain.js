var Util = require('./Util');
var Config = require('./Config');
var Logger = require('./Logger');
var gc = require('./GameController');
var cf = require('./ControllerFactory');
var sp = require('./SocketProxy');
var i18n = require("i18n");

function BoardGameMain(){
	this.SocketProxy = null;
}

BoardGameMain.prototype.initialize = function(){
	Logger.log("Boardgame service started");
	var controllerFactory = cf.ControllerFactory.getInstance();
	controllerFactory.registerController("GameController", gc.GameController);
	this.SocketProxy = new sp.SocketProxy();
	this.SocketProxy.initialize();
	
	i18n.configure({
        locales:['en', 'de'],
        directory: __dirname + '/locales'
    });
}

var main = new BoardGameMain();
main.initialize();