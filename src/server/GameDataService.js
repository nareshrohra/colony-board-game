var Logger = require('./Logger');
var gm = require('./GameModel');

//Data service for game
exports.GameDataService = GameDataService;

function GameDataService(){
	this.Games = new Array();
}

//static/singleton instance for GameDataService
GameDataService.instance = null;

//static method for returning GameDataService instance
GameDataService.getInstance = function(){
	Logger.log("Getting instance for GameDataService");
	if(!GameDataService.instance){
		GameDataService.instance = new GameDataService();
	}
	return GameDataService.instance;
}

GameDataService.prototype.createNewGame = function(boardSize, playerCount){
	var gameCode = this.generateGameCode();
	var game = new gm.Game(boardSize, playerCount, gameCode);
	return game;
}

GameDataService.prototype.addGame = function(game){
	this.Games.push(game);
}

GameDataService.prototype.getGame = function(gameCode){
	Logger.log("Searching for game with game code '"+gameCode+"'");
	for(var i=0; i<this.Games.length; i++){
		if(this.Games[i].GameCode == gameCode){
			return this.Games[i];
		}
	}
	return null;
}

GameDataService.prototype.generateGameCode = function(){
	//Code should be less predictable.
	var curDate = new Date();
	var code = "";
	code = curDate.getUTCHours()+ "" + curDate.getUTCMinutes() + "" + curDate.getUTCSeconds();
	return code;
}