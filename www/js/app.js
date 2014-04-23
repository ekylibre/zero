function App() {
	
	var db;
	
	var current_point;
	var REFRESH_TIME = 5000;
	var optionsLoc = {
		enableHighAccuracy : true,
		timeout : 1000,
		maximumAge : 0
	};

	this.run = function() {
		db = new Database();
		db.dropTable();
		db.init();
		
		var geoloc_interval = setInterval(location, REFRESH_TIME);
	};

	function location() {
		
		getLocation();
		db.storePoint(current_point);
		db.afficher();
	}

	function successLoc(pos) {
		var crd = pos.coords;
		current_point = {
			latitude : crd.latitude,
			longitude : crd.longitude,
			accuracy : crd.accuracy, //accuracy in meters
			date : new Date().toString()
		};
	};

	function errorLoc(err) {
		console.warn('ERROR(' + err.code + '): ' + err.message);
	};

	function getLocation() {
		
		navigator.geolocation.getCurrentPosition(successLoc, errorLoc, optionsLoc);
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

