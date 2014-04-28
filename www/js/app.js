function App() {

	var db = null;

	var REFRESH_TIME = 1000;
	var geoloc_interval = null;

	var optionsLoc = {
		enableHighAccuracy : true,
		timeout : 1000,
		maximumAge : 0
	};

	this.initialize = function() {
		if (db == null) {
			db = new Database();
			db.create();
		} else
			console.log("Database already initialized");
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
			date : new Date().toString(),
			type : typePoint
		};
		db.storePoint(point);
	}

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
	};

	this.resumeIntervention = function() {
		getCurrentPosition(successLocResume);
		run();
	};

	this.endIntervention = function() {
		stop();
		getCurrentPosition(successLocEnd);
	};

	this.pauseIntervention = function() {
		stop();
		getCurrentPosition(successLocPause);
	};
}

