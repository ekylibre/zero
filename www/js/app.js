function App() {

	var db = null;

	var REFRESH_TIME = 1000;
	var geoloc_interval = null;
	var active_mode;
	var running;

	var optionsLoc = {
		enableHighAccuracy : true,
		timeout : 1000,
		maximumAge : 0
	};

	this.initialize = function() {
		if (db == null) {
			db = new Database();
			db.create();
			db.checkLastPoint();
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

	function createLocPoint(crd, typePoint) {
		var point = {
			latitude : crd.latitude,
			longitude : crd.longitude,
			accuracy : crd.accuracy, //accuracy in meters
			date : new Date(),
			type : typePoint
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
		createLocPoint(pos.coords, "start");
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
	this.startIntervention = function() {
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

