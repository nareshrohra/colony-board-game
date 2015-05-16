//Date Object Extension
var days_short = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var months_short = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

Date.prototype.toString=function (format){
	var val = "";
	if(typeof(format)!="undefined"){
		val = format;
		var curDate = this;
		
		val = val.replace("yyyy", ('00'+curDate.getFullYear().toString()).right(4));

		val = val.replace("ddd", days_short[curDate.getDay()]);
		val = val.replace("mmm", months_short[curDate.getMonth()]);
		val = val.replace("MMM", months[curDate.getMonth()]);
		val = val.replace("DDD", days[curDate.getDay()]);

		val = val.replace("hh", ('00'+curDate.getHours().toString()).right(2));
		val = val.replace("mm", ('00'+curDate.getMinutes().toString()).right(2));
		val = val.replace("ss", ('00'+curDate.getSeconds().toString()).right(2));
		val = val.replace("dd", ('00'+curDate.getDate().toString()).right(2));
		val = val.replace("MM", ('00'+(curDate.getMonth()+1).toString()).right(2));
	}
	else{
		val=this.toString("dd-MM-yyyy hh:mm:ss");
	}
	return val;
};

//String Object Extension
String.prototype.right=function(count){
	if(this.length>=count)
		return this.substring(this.length-count, this.length);
	else
		return this.toString();
};

//Array Object Extension
Array.prototype.clear = function(){
	var length=this.length;
	for(var cnt=0;cnt<length;cnt++){
		this.pop();
	}
}

Array.prototype.foreach = function(lambda){
	var length=this.length;
	for(var cnt=0; cnt<length; cnt++){
		lambda(this[cnt]);
	} 
}

Array.prototype.first = function(conditionLambda){
	var length=this.length;
	for(var cnt=0; cnt<length; cnt++){
		if(conditionLambda(this[cnt]))
			return this[cnt];
	} 
}

exports.isDefined=function(variable){
	return (typeof(variable)!="undefined" && variable!=null);
}