var Logger = require('./Logger');
var Config = require('./Config');
var Util = require('./Util');
var cf = require('./ControllerFactory');
var io = require('socket.io');
var http = require('http');

exports.SocketProxy = SocketProxy;

function SocketProxy(){
	this.Socket = null;
	this.Namespace = "/public";
	this.ClientSocketMap = new Object();
}

SocketProxy.prototype.addPlayerSocketMapping = function(clientUid, sessionId){
	if(!this.ClientSocketMap[clientUid]){
		this.ClientSocketMap[clientUid] = sessionId;
	}
}

SocketProxy.prototype.getPlayerSocketMapping = function(clientUid){
	if(this.ClientSocketMap[clientUid]){
		return this.ClientSocketMap[clientUid];
	} else {
		return null;
	}	 
}

SocketProxy.prototype.initialize = function(){
	Logger.log("initializing socket proxy");
	var self = this;
	var ioListener = io.listen(Config.Port);
	var httpListener = http.createServer(function(req, res){
		if(res){
			res.writeHead(200, {});
			res.end();
		}
	});

	ioListener.of(self.Namespace).on('connection', function (socket, data) {
		Logger.log("A new connection is made");
		
		var clientUid = socket.handshake.query.ClientUid;
		self.addPlayerSocketMapping(clientUid, socket.id);
		
		socket.on("clientData", function(data){
			Logger.log("data received from client");
			//Logger.log(data);
			self.onClientData(data, socket);
		});

		socket.on("disconnect", function (had_error) {
		});
		if(!self.Socket)
			self.Socket=socket;
	});
}

SocketProxy.prototype.onClientData = function(request, socket){
	Logger.log("New data received from client");
	var controller = cf.ControllerFactory.getInstance().getController(request.Controller, this);
	if(Util.isDefined(controller)){
		if(Util.isDefined(controller[request.Action])){
			controller[request.Action](request.Data);
		} else {
			Logger.log("Action '"+request.Action+"' not found in controller '"+request.Controller+"'");
		}
	} else {
		Logger.log("Controller '"+request.Controller+"' not found");
	}
}

SocketProxy.prototype.sendView = function(view, receivers){
	var self = this;
	Logger.log("Sending data on socket");
	if(!receivers)
	{
		if(this.Socket.namespace) //Check if socket is open. It might have been closed asynchronously.
			this.Socket.namespace.send(JSON.stringify(view));
	} else {
		receivers.foreach(function(receiver){
			var sessionId = self.getPlayerSocketMapping(receiver);
			if(sessionId){
				var client = self.Socket.to(sessionId);
				if(client){
					client.emit('message', view);
				}
			}
		})
	}
}
