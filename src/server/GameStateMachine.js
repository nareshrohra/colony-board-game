var Logger = require('./Logger');
var i18n = require('i18n');

//Idle state
exports.IdleState = IdleState;
function IdleState(){
	this.CanStartNewGame = true;
	this.CanStartGamePlay = false;
	this.CanShowDashboard = false;
	this.HasInGameOptions = false;
	this.CanShowScore = false;
	this.IsWaitingForPlayers = false;
	this.CanShowBoard = false;
	this.CanPlayerJoin = false;
}

IdleState.instance = null;

IdleState.enter = function(context){
	Logger.log("Entering idle state");
	if(IdleState.instance == null)
		IdleState.instance = new IdleState();
	context.setState(IdleState.instance);
}

IdleState.prototype.startNewGame = function(context, boardSize, playerCount){
	context.startNewGame(boardSize, playerCount);
}

IdleState.prototype.joinGame = function(context, isMasterPlayer, playerCode){
	throw i18n.__('Game_StateError_JoinOperation');
}

IdleState.prototype.startPlaying = function(context){
	throw i18n.__('Game_StateError_StartPlayingOperation');
}

IdleState.prototype.stopGame = function(context){
	throw i18n.__('Game_StateError_StopGameOperation');
}

IdleState.prototype.isGameOver = function(){
	return false;
}

IdleState.prototype.generateGameBoard = function(context){
	context.doGenerateGameBoard();
}

IdleState.prototype.markCell = function(context, playerCode, row, column){
	throw i18n.__('Game_StateError_MarkCellOperation');
}

IdleState.prototype.calculateScore = function(context){
	throw i18n.__('Game_StateError_CalculateScoreOperation');
}

//New game state - all players not yet joined
exports.NewGameState = NewGameState;
function NewGameState(){
	this.CanStartNewGame = false;
	this.CanStartGamePlay = false;
	this.CanShowDashboard = true;
	this.HasInGameOptions = true;
	this.CanShowScore = false;
	this.IsWaitingForPlayers = true;
	this.CanShowBoard = false;
	this.CanPlayerJoin = true;
}

NewGameState.instance = null;

NewGameState.enter = function(context){
	Logger.log("Entering new game state");
	if(NewGameState.instance == null)
		NewGameState.instance = new NewGameState();
	context.setState(NewGameState.instance);
}

NewGameState.prototype.startNewGame = function(context, boardSize, playerCount){
	throw i18n.__('Game_StateError_StartNewGameOperation');
}

NewGameState.prototype.joinGame = function(context, isMasterPlayer, playerCode){
	context.doJoinGame(isMasterPlayer, playerCode);
}

NewGameState.prototype.startPlaying = function(context){
	throw i18n.__('Game_StateError_StartPlayingOperation');
}

NewGameState.prototype.stopGame = function(context){
	context.stopGame();
}

NewGameState.prototype.isGameOver = function(){
	return false;
}

NewGameState.prototype.generateGameBoard = function(context){
	context.doGenerateGameBoard();
}

NewGameState.prototype.markCell = function(context, playerCode, row, column){
	throw i18n.__('Game_StateError_MarkCellOperation');
}

NewGameState.prototype.calculateScore = function(context){
	throw i18n.__('Game_StateError_CalculateScoreOperation');
}

//Game ready state - all players joined
exports.GameReadyState = GameReadyState;
function GameReadyState(){
	this.CanStartNewGame = false;
	this.CanStartGamePlay = true;
	this.CanShowDashboard = true;
	this.HasInGameOptions = true;
	this.CanShowScore = false;
	this.IsWaitingForPlayers = false;
	this.CanShowBoard = false;
	this.CanPlayerJoin = false;
}

GameReadyState.instance = null;

GameReadyState.enter = function(context){
	Logger.log("Entering game ready state");
	if(GameReadyState.instance == null)
		GameReadyState.instance = new GameReadyState();
	context.setState(GameReadyState.instance);
}

GameReadyState.prototype.startNewGame = function(context, boardSize, playerCount){
	throw i18n.__('Game_StateError_StartNewGameOperation');
}

GameReadyState.prototype.joinGame = function(context, isMasterPlayer, playerCode){
	throw i18n.__('Game_StateError_JoinOperation');
}

GameReadyState.prototype.startPlaying = function(context){
	context.doStartPlaying();
}

GameReadyState.prototype.stopGame = function(context){
	context.stopGame();
}

GameReadyState.prototype.isGameOver = function(){
	return false;
}

GameReadyState.prototype.generateGameBoard = function(context){
	throw i18n.__('Game_StateError_GenerateGameBoardOperation');
}

GameReadyState.prototype.markCell = function(context, playerCode, row, column){
	throw i18n.__('Game_StateError_MarkCellOperation');
}

GameReadyState.prototype.calculateScore = function(context){
	throw i18n.__('Game_StateError_CalculateScoreOperation');
}

//In game state - game is in progress
exports.InGameState = InGameState;
function InGameState(){
	this.CanStartNewGame = false;
	this.CanStartGamePlay = false;
	this.CanShowDashboard = true;
	this.HasInGameOptions = true;
	this.CanShowScore = false;
	this.IsWaitingForPlayers = false;
	this.CanShowBoard = true;
	this.CanPlayerJoin = false;
}

InGameState.instance = null;

InGameState.enter = function(context){
	Logger.log("Entering in-game state");
	if(InGameState.instance == null)
		InGameState.instance = new InGameState();
	context.setState(InGameState.instance);
}

InGameState.prototype.startNewGame = function(context, boardSize, playerCount){
	throw i18n.__('Game_StateError_StartNewGameOperation');
}

InGameState.prototype.joinGame = function(context, isMasterPlayer, playerCode){
	throw i18n.__('Game_StateError_JoinOperation');
}

InGameState.prototype.startPlaying = function(context){
	throw i18n.__('Game_StateError_StartPlayingOperation');
}

InGameState.prototype.stopGame = function(context){
	context.stopGame();
}

InGameState.prototype.isGameOver = function(){
	return false;
}

InGameState.prototype.generateGameBoard = function(context){
	throw i18n.__('Game_StateError_GenerateGameBoardOperation');
}

InGameState.prototype.markCell = function(context, playerCode, row, column){
	context.doMarkCell(playerCode, row, column);
}

InGameState.prototype.calculateScore = function(context){
	throw i18n.__('Game_StateError_CalculateScoreOperation');
}

//Game over state - game over
exports.GameOverState = GameOverState;
function GameOverState(){
	this.CanStartNewGame = true;
	this.CanStartGamePlay = false;
	this.CanShowDashboard = true;
	this.HasInGameOptions = false;
	this.CanShowScore = true;
	this.IsWaitingForPlayers = false;
	this.CanShowBoard = true;
	this.CanPlayerJoin = false;
}

GameOverState.instance = null;

GameOverState.enter = function(context){
	Logger.log("Entering game over state");
	if(GameOverState.instance == null)
		GameOverState.instance = new GameOverState();
	context.setState(GameOverState.instance);
}

GameOverState.prototype.startNewGame = function(context, boardSize, playerCount){
	context.startNewGame(boardSize, playerCount);
}

GameOverState.prototype.joinGame = function(context, isMasterPlayer, playerCode){
	throw i18n.__('Game_StateError_JoinOperation');
}

GameOverState.prototype.startPlaying = function(context){
	throw i18n.__('Game_StateError_StartPlayingOperation');
}

GameOverState.prototype.stopGame = function(context){
	context.stopGame();
}

GameOverState.prototype.isGameOver = function(){
	return true;
}

GameOverState.prototype.generateGameBoard = function(context){
	throw i18n.__('Game_StateError_GenerateGameBoardOperation');
}

GameOverState.prototype.markCell = function(context, playerCode, row, column){
	throw i18n.__('Game_StateError_MarkCellOperation');
}

GameOverState.prototype.calculateScore = function(context){
	context.doCalculateScore();
}