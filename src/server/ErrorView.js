var Logger = require('./Logger');
exports.ErrorView = ErrorView;

//View for error
function ErrorView(message){
	this.HasError = true;
	Logger.log(message);
	this.Message = message;
}