var Logger = require('./Logger');
exports.Player = Player;

//Model class for player
function Player(playerCode){
	Logger.log("Player ctor");
	this.Code = playerCode;
	this.Score = 0;
}