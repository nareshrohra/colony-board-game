var Logger = require('./Logger');
var pm = require('./PlayerModel');

exports.PlayerController = PlayerController;

//controller class for Player
function PlayerController(){
	Logger.log("Player Controller ctor");
}

//static/singleton instance for PlayerController
PlayerController.instance = null;

//static method for returning PlayerController instance
PlayerController.getInstance = function(){
	Logger.log("Getting instance for PlayerController");
	if(!PlayerController.instance){
		PlayerController.instance = new PlayerController();
	}
	return PlayerController.instance;
}

PlayerController.prototype.createPlayer = function(playerCode){
	Logger.log("Adding player");
	var player = new pm.Player(playerCode);
	return player;
}