//controller class for Game
function GameViewModel(caller, loadHandler){
	//initialization
	Logger.log("GameView ctor");
	this.controller = "GameController";
	this.State = null;
	this.IsBusy = ko.observable(true);
	
	//Models and data
	this.CurrentPlayer = null;
	this.Model = ko.observable(null);
	this.OnViewRequest = null;
	this.QRCode = null;
	
	//Option controls data
	this.SelectedBoardSizeOption = 0;
	this.SelectedPlayersOption = 0;
	this.PlayersOptions = [new PlayersOption(2), new PlayersOption(4)];
	this.BoardSizeOptions = [new BoardSizeOption(2), new BoardSizeOption(4)];
	this.GameCodeToJoin = ko.observable("");
	
	//for sections visibility
	this.HasError = ko.observable(false);
	this.Error = ko.observable("");
	this.NewGameOptionsVisible = ko.observable(false);
	this.JoinGameOptionsVisible = ko.observable(false);
	this.AboutVisible = ko.observable(false);
	this.HowToPlay = ko.observable(false);
	
	if(loadHandler)
		this.onLoad = function(){loadHandler.call(caller)};
}

//for sections visibility
GameViewModel.prototype.hideVisibleSection = function(){
}

GameViewModel.prototype.showNewGameOptions = function(){
	var self = this;
	this.hideVisibleSection();
	this.setModel(null);
	this.NewGameOptionsVisible(true);
	this.hideVisibleSection = function() { self.hideNewGameOptions(); };
}

GameViewModel.prototype.hideNewGameOptions = function(){
	this.NewGameOptionsVisible(false);
}

GameViewModel.prototype.showJoinGameOptions = function(){
	var self = this;
	this.hideVisibleSection();
	this.setModel(null);
	this.JoinGameOptionsVisible(true);
	this.hideVisibleSection = function() { self.hideJoinGameOptions(); };
}

GameViewModel.prototype.hideJoinGameOptions = function(){
	this.JoinGameOptionsVisible(false);
}

GameViewModel.prototype.showAbout = function(){
	var self = this;
	this.hideVisibleSection();
	this.setModel(null);
	this.AboutVisible(true);
	this.hideVisibleSection = function() { self.hideAbout(); };
}

GameViewModel.prototype.hideAbout = function(){
	this.AboutVisible(false);
}

GameViewModel.prototype.showHowToPlay = function(){
	var self = this;
	this.hideVisibleSection();
	this.setModel(null);
	this.HowToPlay(true);
	this.hideVisibleSection = function() { self.hideHowToPlay(); };
}

GameViewModel.prototype.hideHowToPlay = function(){
	this.HowToPlay(false);
}

GameViewModel.prototype.setBusy = function(flag){
	this.IsBusy(flag);
}

GameViewModel.prototype.setState = function(state){
	this.State = state;
}

//Register handler for receiving view data
GameViewModel.prototype.registerRequestDataHandler = function(viewRequestHandler, caller){
	this.OnViewRequest = function(requestData){viewRequestHandler.call(caller, requestData)};
}

//Model, view setters
GameViewModel.prototype.setCurrentPlayer = function(player){
	this.CurrentPlayer = player;
}

GameViewModel.prototype.updateViewModel = function(view){
	if(view.HasError){
		this.setError(view.Message);
	} else {
		this.State.updateViewModel(this, view.Model);
	}
	this.HasError(view.HasError);
	GameViewIdle.enter(this);
}

GameViewModel.prototype.setError = function(errorMsg){
	if(typeof errorMsg === "string"){
		this.Error(errorMsg);
	} else {
		Logger.log(errorMsg);
		this.Error("An error occured in operation");
	}
}

GameViewModel.prototype.setModel = function(model){
	if(this.Model){
		this.Model(model);
		if(model && model.Winners && model.Winners.length > 0)
			debugger;
	} else {
		this.Model = ko.observable(model);
	}
	if(this.Model() && this.Model().GameCode && this.Model().GameCode !== "")
		this.setQRCode();
}

GameViewModel.prototype.setQRCode = function(){
	var url = location.href+"?action=join&code="+this.Model().GameCode;
	Logger.log(url);
	var qrCode = this.QRCode;
	if(qrCode) {
		if(qrCode._htOption.text !== url) {
			qrCode.clear();
			qrCode.makeCode(url);
		}
	} else {
		qrCode = new QRCode("qrcode", {
						text: url,
						width: 128,
						height: 128,
						colorDark : "#000000",
						colorLight : "#ffffff",
						correctLevel : QRCode.CorrectLevel.H
					});
		this.QRCode = qrCode;
	}
}

GameViewModel.prototype.displayNewQRCode = function(url){
	var qrCode = new QRCode("qrcode", {
		text: url,
		width: 128,
		height: 128,
		colorDark : "#000000",
		colorLight : "#ffffff",
		correctLevel : QRCode.CorrectLevel.H
	});
	return qrCode;
}

GameViewModel.prototype.displayQRCode = function(url){
	
}

//initial load sequence
GameViewModel.prototype.load = function(params){
	GameViewLoading.enter(this);
	this.State.updateViewModel(this, null);
	GameViewIdle.enter(this);
}

GameViewModel.prototype.constructLoadRequest = function(params){
	var requestData = null;
	var contextData = null;
	var action = "";
	if(params && params.action){
		switch(params.action.toUpperCase()) {
			case "JOIN":
				contextData = {PlayerCode : this.CurrentPlayer.Code, GameCode: params.code};
				action = "joinGame";
				break;
		}
	} else {
		contextData = {PlayerCode : this.CurrentPlayer.Code};
		action = "startup";
	}
	requestData = {Controller: this.controller, Action: action, Data: contextData};
	return requestData;
}

//Button action handlers for Game options
GameViewModel.prototype.startNewGame = function(){
	GameViewServerResponseWaiting.enter(this);
	Logger.log("Starting new game with board-size " + this.SelectedBoardSizeOption.Size + " and " + this.SelectedPlayersOption.Count + " players");
	var contextData = {PlayerCode : this.CurrentPlayer.Code, BoardSize: this.SelectedBoardSizeOption.Size, PlayerCount: this.SelectedPlayersOption.Count};
	var requestData = {Controller: this.controller, Action: "startNewGame", Data: contextData};
	this.OnViewRequest(requestData);
	this.hideVisibleSection();
}

GameViewModel.prototype.joinGame = function(){
	GameViewServerResponseWaiting.enter(this);
	var contextData = {PlayerCode : this.CurrentPlayer.Code, GameCode: this.GameCodeToJoin()};
	var requestData = {Controller: this.controller, Action: "joinGame", Data: contextData};
	this.OnViewRequest(requestData);
	this.hideVisibleSection();
}

GameViewModel.prototype.startPlaying = function(){
	GameViewServerResponseWaiting.enter(this);
	var contextData = {PlayerCode : this.CurrentPlayer.Code, GameCode: this.Model().GameCode};
	var requestData = {Controller: this.controller, Action: "startPlaying", Data: contextData};
	this.OnViewRequest(requestData);
	this.hideVisibleSection();
}

GameViewModel.prototype.stopGame = function(){
	GameViewServerResponseWaiting.enter(this);
	var contextData = {PlayerCode : this.CurrentPlayer.Code, GameCode: this.Model().GameCode};
	var requestData = {Controller: this.controller, Action: "stopGame", Data: contextData};
	this.OnViewRequest(requestData);
	this.hideVisibleSection();
}

GameViewModel.prototype.markCell = function(data){
	GameViewServerResponseWaiting.enter(this);
	var contextData = {PlayerCode : this.CurrentPlayer.Code, GameCode: this.Model().GameCode, Row: data.Row, Column: data.Column};
	var requestData = {Controller: this.controller, Action: "markCell", Data: contextData};
	this.OnViewRequest(requestData);
	this.hideVisibleSection();
}

//setters for New game option selection
function PlayersOption(count){
	this.Count = count;
}

function BoardSizeOption(size){
	this.Size = size;
}

// Custom binding handler for fade visibility of panels
//credits: http://knockoutjs.com/examples/animatedTransitions.html
ko.bindingHandlers.fadeVisible = {
	init: function(element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function(element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.unwrap(value) ? $(element).fadeIn(Config.FadeInDuration) : $(element).fadeOut(Config.FadeOutDuration*.10);
    }
};
