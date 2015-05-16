exports.ErrorView = ErrorView;

//View for error
function ErrorView(message){
	this.HasError = true;
	this.Message = message;
}