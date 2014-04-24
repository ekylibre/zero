

var timercount = 0;
var timestart  = null;

function showtimer() {
	if(timercount) {
		clearTimeout(timercount);
		clockID = 0;
	}
	if(!timestart){
		timestart = new Date();
	}
	var timeend = new Date();
	var timedifference = timeend.getTime() - timestart.getTime();
	timeend.setTime(timedifference);
	var minutes_passed = timeend.getMinutes();
	if(minutes_passed < 10){
		minutes_passed = "0" + minutes_passed;
	}
	var seconds_passed = timeend.getSeconds();
	if(seconds_passed < 10){
		seconds_passed = "0" + seconds_passed;
	}
	document.timeform.timetextarea.value = minutes_passed + ":" + seconds_passed;
	timercount = setTimeout("showtimer()", 1000);
}

function start(){
	if(!timercount){
	timestart   = new Date();
	document.timeform.timetextarea.value = "00:00";
	timercount  = setTimeout("showtimer()", 1000);
	}
	else{
	var timeend = new Date();
		var timedifference = timeend.getTime() - timestart.getTime();
		timeend.setTime(timedifference);
		var hour_passed = timeend.getHours();
		if(hour_passed < 10){
			hour_passed = "0" + hour_passed;
		}
		var minutes_passed = timeend.getMinutes();
		if(minutes_passed < 10){
			minutes_passed = "0" + minutes_passed;
		}
		var seconds_passed = timeend.getSeconds();
		if(seconds_passed < 10){
			seconds_passed = "0" + seconds_passed;
		}
	}
}

function stop() {
	if(timercount) {
		clearTimeout(timercount);
		timercount  = 0;
		var timeend = new Date();
		var timedifference = timeend.getTime() - timestart.getTime();
		timeend.setTime(timedifference);
		var minutes_passed = timeend.getMinutes();
		if(minutes_passed < 10){
			minutes_passed = "0" + minutes_passed;
		}
		var seconds_passed = timeend.getSeconds();
		if(seconds_passed < 10){
			seconds_passed = "0" + seconds_passed;
		}
		document.timeform.timetextarea.value = minutes_passed + ":" + seconds_passed;
	}
	timestart = null;
}

function pause(){
	
}

function Reset() {
	timestart = null;
	document.timeform.timetextarea.value = "00:00";
}