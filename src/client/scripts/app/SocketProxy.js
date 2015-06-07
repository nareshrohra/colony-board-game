//this is required by socket.io library
var WEB_SOCKET_SWF_LOCATION = "scripts/socket_io/WebSocketMain.swf";

function SocketProxy(caller, viewDataHandler, connectHandler, reconnectHandler, disconnectHandler){
	this.Socket = null;
	this.Namespace = "public";
	this.onViewData = function(view){viewDataHandler.call(caller, view)};
	if(connectHandler)
		this.onConnect = function(){connectHandler.call(caller)};
	if(reconnectHandler)
		this.onReconnect = function(){reconnectHandler.call(caller)};
	if(disconnectHandler)
		this.onDisconnect = function(error){disconnectHandler.call(caller)};
}

SocketProxy.prototype.connect = function(clientUid){
	var self = this;
	if(this.Socket ==null || !this.Socket.connected)
	{
		var host = location.hostname;
		var port=Config.Port;
		
		if (this.Socket != null && this.Socket.io.opts.host == host && this.Socket.io.opts.port == port && this.Socket.nsp == self.Namespace) {
			this.Socket.reconnect();
			return;
		}

		var url = 'http://'+host+':'+port+'/'+self.Namespace;
		this.Socket = io.connect(url, {query: "ClientUid="+clientUid});
		this.Socket.on('message', function (data) { self.onViewData(data); });
		this.Socket.on('connect', function (){
			Logger.log("Connection established");
			if(self.onConnect){
				self.onConnect();
				//connect callback shouldn't be called again for this proxy. instead call reconnect callback
				self.onConnect=null;
			} else if(self.onReconnect){
				self.onReconnect();
			}
		});
		this.Socket.on('disconnect', function (){ 
			Logger.log("Disconnected");
			if(self.onDisonnect){
				self.onDisonnect(); 
			}
			
		});
		this.Socket.on('close', function (){ 
			Logger.log("Connection closed"); 
		});
	}
}

SocketProxy.prototype.disconnect = function(){
	this.Socket.disconnect();
}

SocketProxy.prototype.send = function(data) {
	var message = "";
	if(data){
		if(typeof(data)=="object"){
			message=JSON.stringify(data);
		}
		else{
			message=data;
		}
	}
	Logger.log(this.Socket.nsp);
	this.Socket.emit("clientData", data);
}
