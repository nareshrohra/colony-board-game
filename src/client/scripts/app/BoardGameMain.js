function BoardGameMain(){
	this.GameViewModel = null;
	this.SocketProxy = null;
}

BoardGameMain.prototype.onViewResponse = function(view){
	Logger.log("Received data");
	this.GameViewModel.updateViewModel(view);
}

BoardGameMain.prototype.onViewRequest = function(viewRequest){
	Logger.log("Sending request data");
	//Logger.log(viewRequest);
	this.SocketProxy.send(viewRequest);
}

BoardGameMain.prototype.run = function(){
	//create view model
	this.GameViewModel = new GameViewModel(this, function(){
		ko.applyBindings(this.GameViewModel);
	});
	var player = this.getPlayerInfo();
	this.GameViewModel.setCurrentPlayer(player);
	
	//create and initialize socket
	this.SocketProxy = new SocketProxy(this, this.onViewResponse, this.loadView);
	var self = this;
	this.SocketProxy.connect(player.Code);
	
	this.GameViewModel.registerRequestDataHandler(this.onViewRequest, this);
}

BoardGameMain.prototype.loadView = function(){
	//create and load view for game
	var params = purl(window.location).param();
	this.GameViewModel.load(params);
}

BoardGameMain.prototype.getPlayerInfo = function(){
	var playerCode = Util.generatePlayerCode();
	var player = new Player(playerCode);
	return player;
}

$( document ).ready(function() {
	main = new BoardGameMain();
	main.run();
});
var main;