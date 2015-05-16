function Logger(){

};

Logger.log = function(data){
	if(console && console.debug)
	{
		console.debug(data);
	}
};