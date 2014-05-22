function App() {

	var db = null;

	var REFRESH_TIME = 1000;
	var geoloc_interval = null;
	var active_mode;
	var running;
	var intervention_name;

	var optionsLoc = {
		enableHighAccuracy : true,
		timeout : 1000,
		maximumAge : 0
	};

	this.initialize = function() {
		if (db == null) {
			db = new Database();
			db.create();
			running = false;
			db.writeInterventions();
		} else
			console.log("Database already initialized");
		active_mode = false;
	};

	///////////////////////////////////////
	function run() {
		if (geoloc_interval == null) {
			geoloc_interval = setInterval(location, REFRESH_TIME);
		}
	}

	function stop() {
		clearInterval(geoloc_interval);
		geoloc_interval = null;
	}

	function locationIsRunning() {
		return geoloc_interval != null;
	}


	this.activeMode = function() {
		return active_mode;
	};
	/////////////////////////////////////

	//Fonction principale appellée tous les REFRESH_TIME
	function location() {
		getCurrentPosition(successLoc);
	}

	function createLocPoint(crd, typePoint, name) {
		var point = {
			latitude : crd.latitude,
			longitude : crd.longitude,
			accuracy : crd.accuracy, //accuracy in meters
			date : new Date(),
			type : typePoint,
			name : name
		};
		if (typePoint == 'end' || typePoint == 'start')
			db.storePoint(point, db.writeInterventions);
		else
			db.storePoint(point);
	}


	this.showInterventions = function() {
		db.writeInterventions();
	};

	//////////////////////////////////////

	function successLocStart(pos) {
		createLocPoint(pos.coords, "start", intervention_name);
	}

	function successLocResume(pos) {
		createLocPoint(pos.coords, "resume");
	}

	function successLocEnd(pos) {
		createLocPoint(pos.coords, "end");
	}

	function successLocPause(pos) {
		createLocPoint(pos.coords, "pause");
	}

	function successLoc(pos) {
		createLocPoint(pos.coords, "loc");
	}

	function successLocActiveModeOn(pos) {
		createLocPoint(pos.coords, "Active-mode-on");
	}

	function successLocActiveModeOff(pos) {
		createLocPoint(pos.coords, "Active-mode-off");
	}

	function errorLoc(err) {
		console.warn('ERROR(' + err.code + '): ' + err.message);
	}

	function getCurrentPosition(successLocation) {
		navigator.geolocation.getCurrentPosition(successLocation, errorLoc, optionsLoc);
	}

	////////////////////////////////////////

	this.pushData = function() {
		if (window.localStorage.getItem("user") != null)
			db.send();	
		else
			$("#errorLabel").text("utilisateur non identifié");
	};

	//Creation des points
	//	url (String): URl de la pa ge à charger
	//params (Map): (optionnel) paires de clé/valeur qui seront envoyées au serveur.
	//callback (Fonction): (optionnel) fonction qui sera éxécutée dès que les données seront complètement chargées.

	////////////////////////////////////////
	this.startIntervention = function(name) {
		intervention_name = name;
		getCurrentPosition(successLocStart);
		run();
		running = true;
	};

	this.resumeIntervention = function() {
		getCurrentPosition(successLocResume);
		run();
	};

	this.endIntervention = function() {
		stop();
		getCurrentPosition(successLocEnd);
		running = false;
	};

	this.pauseIntervention = function() {
		stop();
		getCurrentPosition(successLocPause);
	};

	this.activeModeOn = function() {
		if (locationIsRunning() && !active_mode) {
			active_mode = true;
			getCurrentPosition(successLocActiveModeOn);
		}
	};

	this.activeModeOff = function() {
		if (locationIsRunning() && active_mode) {
			active_mode = false;
			getCurrentPosition(successLocActiveModeOff);
		}
	};
}

