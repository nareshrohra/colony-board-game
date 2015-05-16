//Loading state
function GameViewLoading(){
}

GameViewLoading.instance = null;

GameViewLoading.enter = function(context){
	Logger.log("Entering idle state for GameView");
	if(GameViewLoading.instance == null)
		GameViewLoading.instance = new GameViewLoading();
	context.setState(GameViewLoading.instance);
	context.setBusy(true);
}

GameViewLoading.prototype.updateViewModel = function(context, model){
	context.setModel(model);
	context.onLoad();
}

//Idle state
function GameViewIdle(){
}

GameViewIdle.instance = null;

GameViewIdle.enter = function(context){
	Logger.log("Entering idle state for GameView");
	if(GameViewIdle.instance == null)
		GameViewIdle.instance = new GameViewIdle();
	context.setState(GameViewIdle.instance);
	context.setBusy(false);
}

GameViewIdle.prototype.updateViewModel = function(context, model){
	context.setModel(model);
}

//Server response waiting state
function GameViewServerResponseWaiting(){
}

GameViewServerResponseWaiting.instance = null;

GameViewServerResponseWaiting.enter = function(context){
	Logger.log("Entering server response waiting state for GameView");
	if(GameViewServerResponseWaiting.instance == null)
		GameViewServerResponseWaiting.instance = new GameViewServerResponseWaiting();
	context.setState(GameViewServerResponseWaiting.instance);
	context.setBusy(true);
}

GameViewServerResponseWaiting.prototype.updateViewModel = function(context, model){
	context.setModel(model);
}
