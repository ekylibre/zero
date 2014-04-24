function App() {

	var db = null;

	var current_point;
	var REFRESH_TIME = 1000;
	var geoloc_interval = null;

	var optionsLoc = {
		enableHighAccuracy : true,
		timeout : 1000,
		maximumAge : 0
	};

	 this.initialize=function(){
		if (db == null) {
			db = new Database();
			db.create();
		}
		else
			console.log("Database already initialized");
	};

	function run() {
		if (geoloc_interval == null)
			geoloc_interval = setInterval(location, REFRESH_TIME);
	}

	function stop() {
		clearInterval(geoloc_interval);
		geoloc_interval = null;
	}

	//Fonction principale appellée tous les REFRESH_TIME
	function location() {
		getLocation();
		current_point.type = "point";
		db.storePoint(current_point);
	}

	//Recuperation des coordonnées
	function successLoc(pos) {
		var crd = pos.coords;
		current_point = {
			latitude : crd.latitude,
			longitude : crd.longitude,
			accuracy : crd.accuracy, //accuracy in meters
			date : new Date().toString(),
			type : "point"
		};
	};

	function errorLoc(err) {
		console.warn('ERROR(' + err.code + '): ' + err.message);
	};

	function getLocation() {
		navigator.geolocation.getCurrentPosition(successLoc, errorLoc, optionsLoc);
	};

	this.startIntervention = function() {
		getLocation();
		setTimeout(function() {
			current_point.type = "start";
			db.storePoint(current_point);
			run();
		}, 1000);
	};

	this.endIntervention = function() {
		getLocation();
		setTimeout(function() {
			current_point.type = "end";
			db.storePoint(current_point);
			stop();
		}, 1000);
	};
	/*	function printLocation() {
	 var size = localStorage.length;
	 data_string = "";

	 for (var i = 0; i < localStorage.length; i++) {
	 key = window.localStorage.key(i);

	 var value = JSON.parse(window.localStorage.getItem(key));
	 data_string += "Latitude = " + value["latitude"] + "<br> Longitude = " + value["longitude"] + "<br> Date = " + value["date"] + "<br> <br>";
	 }
	 document.getElementById('affichage').innerHTML = data_string;
	 }*/

}

