function App() {
	
	var db;
	
	var current_point;
	var current_intervention;
	var REFRESH_TIME = 1000;
	var optionsLoc = {
		enableHighAccuracy : true,
		timeout : 1000,
		maximumAge : 0
	};

	this.run = function() {
		db = new Database();
		db.dropTablePoints();
		db.init();
		
		var geoloc_interval = setInterval(location, REFRESH_TIME);
	};

//Fonction principale appellée tous les REFRESH_TIME
	function location() {
		getLocation();
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
			intervention : current_intervention
		};
	};

	function errorLoc(err) {
		console.warn('ERROR(' + err.code + '): ' + err.message);
	};

	function getLocation() {
		navigator.geolocation.getCurrentPosition(successLoc, errorLoc, optionsLoc);
	};
	
	
	function startIntervention(){
		var intervention_id;
		if (current_intervention==undefined)
			intervention_id=0;
		else
			intervention_id=current_intervention.id;
			
		current_intervention={
			id : intervention_id,
			status : 'running',
		};
		
	}

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

