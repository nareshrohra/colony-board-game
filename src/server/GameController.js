var Logger = require('./Logger');
var gds = require('./GameDataService');
var gv = require('./GameView');
var ev = require('./ErrorView');
var gsm = require('./GameStateMachine');
var i18n = require('i18n');

exports.GameController = GameController;

//controller class for Game
function GameController(socketProxy){
	Logger.log("GameController ctor");
	this.DataService = gds.GameDataService.getInstance();
	this.SocketProxy = socketProxy;
}

GameController.prototype.flushView = function(view, receivers){
	Logger.log(view);
	this.SocketProxy.sendView(view, receivers);
}

//start new game
GameController.prototype.startup = function(data){
	Logger.log("starting up");
	try{
		//create model
		var game = this.DataService.createNewGame(4, 2);
		game.GameCode = "";
		gsm.IdleState.enter(game);
		
		//create view
		var viewModel = new gv.GameView(game);
		
		//send view model to socket
		this.flushView(viewModel, [data.PlayerCode]);
	}
	catch(err){
		this.flushView(new ev.ErrorView(err), [data.PlayerCode]);
	}
}

//start new game
GameController.prototype.startNewGame = function(data){
	Logger.log("staring new game");
	try {
		var game = this.DataService.createNewGame(data.BoardSize, data.PlayerCount);
		this.DataService.addGame(game);
		
		gsm.NewGameState.enter(game);
		
		//add player as master player;
		var currentPlayer = game.joinGame(true, data.PlayerCode);
		game.generateGameBoard();
		
		//create view
		var viewModel = new gv.GameView(game);
		
		//send view to socket
		this.flushView(viewModel, [data.PlayerCode]);
	}
	catch(err){
		Logger.log(err);
		this.flushView(new ev.ErrorView(err), [data.PlayerCode]);
	}
}

//join game
GameController.prototype.joinGame = function(data){
	Logger.log("joining new game");
	try{
		if(data.GameCode != ""){
			var game = this.DataService.getGame(data.GameCode);
			if(game != null){
				//add player to game;
				game.joinGame(false, data.PlayerCode);
					
				if(!game.canPlayerJoin()){
					gsm.GameReadyState.enter(game);
				}
				
				//create view
				var viewModel = new gv.GameView(game);
				
				//send view to socket
				this.flushView(viewModel, game.getPlayerCodes());
			} else {
				//send error view to socket
				this.flushView(new ev.ErrorView(i18n.__('Game_DataError_GameUnavailable')), [data.PlayerCode]);
			}
		} else {
			//send error view to socket
			this.flushView(new ev.ErrorView(i18n.__('Game_ValidationError_InvalidGameCode')), [data.PlayerCode]);
		}
	}
	catch(err){
		this.flushView(new ev.ErrorView(err), [data.PlayerCode]);
	}
}

//start game play
GameController.prototype.startPlaying = function(data){
	Logger.log("start playing game");
	try{
		if(data.GameCode != ""){
			var game = this.DataService.getGame(data.GameCode);
			if(game != null){
				game.startPlaying();
				gsm.InGameState.enter(game);
				
				//create view
				var viewModel = new gv.GameView(game);
				
				//send view to socket
				this.flushView(viewModel, game.getPlayerCodes());
			} else {
				//send error view to socket
				this.flushView(new ev.ErrorView(i18n.__('Game_DataError_GameUnavailable')), [data.PlayerCode]);
			}
		} else {
			//send error view to socket
			this.flushView(new ev.ErrorView(i18n.__('Game_ValidationError_InvalidGameCode')), [data.PlayerCode]);
		}
	}
	catch(err){
		this.flushView(new ev.ErrorView(err), [data.PlayerCode]);
	}
}

//stop game
GameController.prototype.stopGame = function(data){
	Logger.log("stop game");
	try{
		if(data.GameCode != ""){
			var game = this.DataService.getGame(data.GameCode);
			if(game != null){
				gsm.GameOverState.enter(game);
				
				this.startup(data);
			} else {
				//send error view to socket
				this.flushView(new ev.ErrorView(i18n.__('Game_DataError_GameUnavailable')), [data.PlayerCode]);
			}
		} else {
			//send error view to socket
			this.flushView(new ev.ErrorView(i18n.__('Game_ValidationError_InvalidGameCode')), [data.PlayerCode]);
		}
	}
	catch(err){
		this.flushView(new ev.ErrorView(err), [data.PlayerCode]);
	}
}

//stop game
GameController.prototype.markCell = function(data){
	Logger.log("marking cell");
	try{
		if(data.GameCode != ""){
			var game = this.DataService.getGame(data.GameCode);
			if(game != null){
				//check if player's turn is next
				if(game.isPlayerTurn(data.PlayerCode)) {
					//mark cell
					game.markCell(data.PlayerCode, data.Row, data.Column);
					
					if(game.isBoardFull()){
						gsm.GameOverState.enter(game);
						game.calculateScore();
					}

					//create view
					var viewModel = new gv.GameView(game);
					
					//send view to socket
					this.flushView(viewModel, game.getPlayerCodes());
				} else {
					//send error view to socket
					this.flushView(new ev.ErrorView(i18n.__('Game_ValidationError_IllegalMove')), [data.PlayerCode]);
				}
			} else {
				//send error view to socket
				this.flushView(new ev.ErrorView(i18n.__('Game_DataError_GameUnavailable')), [data.PlayerCode]);
			}
		} else {
			//send error view to socket
			this.flushView(new ev.ErrorView(i18n.__('Game_ValidationError_InvalidGameCode')), [data.PlayerCode]);
		}
	}
	catch(err){
		this.flushView(new ev.ErrorView(err), [data.PlayerCode]);
	}
}