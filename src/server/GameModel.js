var Logger = require('./Logger');
var pc = require('./PlayerController');

exports.Game = Game;

//Model class for game
function Game(boardSize, playersCount, gameCode){
	Logger.log("Game ctor");
	this.BoardSize = boardSize;
	this.State = null;
	this.GameCode = gameCode;
	this.filledCellsCount = 0;
	this.maxPlayersCount = playersCount;
	this.MasterPlayerCode = null;
	this.NextTurnPlayer = 0;
	this.Players = new Array();	
	this.Cells = new Array();
	this.Winners = new Array();
}

Game.prototype.setState = function(state){
	Logger.log("Setting state for game controller");
	this.State = state;
}

Game.prototype.isPlayerTurn = function(playerCode){
	var flag = false;
	if(this.NextTurnPlayer > 0 && this.NextTurnPlayer <= this.Players.length){
		flag = this.Players[this.NextTurnPlayer-1].Code == playerCode;
	}
	return flag;
}

Game.prototype.isGameOver = function(){
	return this.State.isGameOver();
}

Game.prototype.joinGame = function(isMasterPlayer, playerCode){
	this.State.joinGame(this, isMasterPlayer, playerCode);
}

Game.prototype.doJoinGame = function(isMasterPlayer, playerCode){
	var player = new pc.PlayerController().createPlayer(playerCode);
	this.Players.push(player);
	if(isMasterPlayer){
		this.MasterPlayerCode = playerCode;
	}
}

Game.prototype.getMasterPlayer = function(){
	return this.masterPlayer;
}

Game.prototype.isBoardFull = function(){
	return this.filledCellsCount == (this.BoardSize * this.BoardSize);
}

Game.prototype.canPlayerJoin = function(){
	return this.Players.length < this.maxPlayersCount;
}

Game.prototype.startPlaying = function(){
	this.State.startPlaying(this);
}

Game.prototype.doStartPlaying = function(){
	this.NextTurnPlayer = 1;
}

Game.prototype.generateGameBoard = function(){
	this.State.generateGameBoard(this);
}

Game.prototype.doGenerateGameBoard = function(){
	Logger.log("Generating board for game with board size "+this.BoardSize);
	var cell;
	for(row=1; row<=this.BoardSize; row++){
		for(col=1; col<=this.BoardSize; col++){
			cell = new Cell(row, col);
			this.Cells.push(cell);
		}
	}
}

Game.prototype.markCell = function(playerCode, row, column){
	this.State.markCell(this, playerCode, row, column);
}

Game.prototype.doMarkCell = function(playerCode, row, column){
	var cellIndex = (row-1) * this.BoardSize + (column-1);
	var cell = this.Cells[cellIndex];
	if(cell != null){
		if(cell.PlayerCode == null) {
			cell.PlayerCode = playerCode;
			cell.ColorCode = this.getPlayerColorCode(playerCode);
			this.filledCellsCount++;
		}
	}
	this.NextTurnPlayer=(this.NextTurnPlayer % this.Players.length) + 1;
}

Game.prototype.getPlayerColorCode = function(playerCode){
	var length=this.Players.length;
	for(var i=0; i<length; i++){
		if(this.Players[i].Code == playerCode){
			return i+1;
		}
	}
	return 0;
}

Game.prototype.calculateScore = function(){
	Logger.log("Calculating score");
	this.State.calculateScore(this);
}

Game.prototype.doCalculateScore = function(){
	Logger.log("Calculating score");
	this.calculateCellWeightage();
	this.determineWinners();
}

//determine winner(s) and add the player's code in this.WinnerPlayersCode array
Game.prototype.determineWinners = function(){
	var maxScore = 0;
	var noOfPlayers = this.Players.length;
	
	//check score of players to see if they have beaten current max score 
	for(var cnt=0; cnt<noOfPlayers; cnt++){
		player = this.Players[cnt];
		if(maxScore == player.Score){
			this.Winners.push(cnt+1);
		} else if (maxScore < player.Score) {
			maxScore = player.Score;
			//clear existing winners
			this.Winners.length = 0;
			//add this player as the new winner
			this.Winners.push(cnt+1);
		}
	}
}

//Calculate weightage for each cell
Game.prototype.calculateCellWeightage = function(){
	var cellCount = this.Cells.length;
	for(var cnt=1; cnt<=cellCount; cnt++){
		if(this.Cells[cnt-1].PlayerCode != null){
			var cellWeight=0;
			var currentCell = this.Cells[cnt-1];
			var playerCode = currentCell.PlayerCode;
			
			cellWeight+=this.matchCellOwner(playerCode, (cnt-this.BoardSize-1), "nw");	//north-west cell
			cellWeight+=this.matchCellOwner(playerCode, (cnt-this.BoardSize), "nc");		//north cell
			cellWeight+=this.matchCellOwner(playerCode, (cnt-this.BoardSize+1), "ne");	//north-east cell
			
			cellWeight+=this.matchCellOwner(playerCode, (cnt-1), "w");		//west cell
			cellWeight+=this.matchCellOwner(playerCode, (cnt+1), "e");		//east cell
			
			cellWeight+=this.matchCellOwner(playerCode, (cnt+this.BoardSize-1), "sw");	//south-west cell
			cellWeight+=this.matchCellOwner(playerCode, (cnt+this.BoardSize), "s");		//south cell
			cellWeight+=this.matchCellOwner(playerCode, (cnt+this.BoardSize+1), "se");	//south-east cell
			
			currentCell.Weight=cellWeight;
			
			var player = this.Players.first(function(p){
				return p.Code == playerCode;
			});
			
			if(player)
				player.Score += currentCell.Weight;
		}
	}
}
	
Game.prototype.matchCellOwner=function(playerCode, matchCellNo, direction){
	var weight=0;
	if(
			matchCellNo<1 || matchCellNo>(this.BoardSize*this.BoardSize) //out of bounds
			|| ((matchCellNo%this.BoardSize)==1 && (direction=="ne" || direction=="e" || direction=="se")) //first column of any row
			|| ((matchCellNo%this.BoardSize)==0 && (direction=="nw" || direction=="w" || direction=="sw")) //last column of any row
		){
		return weight;
	} else {
		//console.log(matchCellNo);
		if(this.Cells[matchCellNo-1].PlayerCode==playerCode){
			weight++;
		}
	}
	return weight;
}

Game.prototype.getPlayerCodes=function(){
	var playerCodes = this.Players.map(function (player){
		return player.Code;
	});
	return playerCodes;
}
function Cell(row, col){
	this.Row=row;
	this.Column=col;
	this.ColorCode=0;
	this.PlayerCode=null;
	this.Weight=-1;
}