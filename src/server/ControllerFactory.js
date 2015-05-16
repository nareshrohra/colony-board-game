var Util = require('./Util');
var Logger = require('./Logger');

exports.ControllerFactory = ControllerFactory;

function ControllerFactory(){
	this.FactoryConfiguration = new Array();
}

//static/singleton instance for ControllerFactory
ControllerFactory.instance = null;

//static method for returning ControllerFactory instance
ControllerFactory.getInstance = function(){
	Logger.log("Getting instance for ControllerFactory");
	if(!ControllerFactory.instance){
		ControllerFactory.instance = new ControllerFactory();
	}
	return ControllerFactory.instance;
}

ControllerFactory.prototype.registerController = function(name, ctor){
	Logger.log("Registering controller for '"+name+"'");
	var configElement = new ControllerFactoryConfigurationElement(name, ctor);
	this.FactoryConfiguration.push(configElement);
}

ControllerFactory.prototype.getController = function(name, socket){
	Logger.log("Getting controller instance for '"+name+"'");
	var controller = null;
	var length = this.FactoryConfiguration.length;
	for(var i=0; i<length; i++){
		if(this.FactoryConfiguration[i].Name == name){
			controller = new this.FactoryConfiguration[i].Ctor(socket);
			break;
		}
	}
	return controller;
}

function ControllerFactoryConfigurationElement(name, ctor){
	this.Name = name;
	this.Ctor = ctor;
}