function App() {

	var db = null;

	var REFRESH_TIME = 1000;
	var geoloc_interval = null;
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
		} else
			console.log("Database already initialized");
	};

	///////////////////////////////////////
	function run() {
		if (geoloc_interval == null) {
			geoloc_interval = setInterval(location, REFRESH_TIME);
			running = true;
		}
	}

	function stop() {
		running = false;
		clearInterval(geoloc_interval);
		geoloc_interval = null;
	}

	/////////////////////////////////////

	//Fonction principale appellée tous les REFRESH_TIME
	function location() {
		navigator.geolocation.getCurrentPosition(successLoc, errorLoc, optionsLoc);
	}

	function createLocPoint(crd, typePoint) {
		var point = {
			latitude : crd.latitude,
			longitude : crd.longitude,
			accuracy : crd.accuracy, //accuracy in meters
			date : new Date().toString(),
			type : typePoint
		};
		return point;
	}

	//////////////////////////////////////

	function successLoc(pos) {
		if (running) {
			var crd = pos.coords;
			var point = createLocPoint(crd, "loc_point");
			db.storePoint(point);
		}

	};

	function successLocStart(pos) {
		var crd = pos.coords;
		var point = createLocPoint(crd, "start_point");
		db.storePoint(point);
		run();
	};

	function successLocEnd(pos) {
		stop();
		var crd = pos.coords;
		var point = createLocPoint(crd, "end_point");
		db.storePoint(point);
	};

	function errorLoc(err) {
		console.warn('ERROR(' + err.code + '): ' + err.message);
	};

	///////////////////////////////////
	this.startIntervention = function() {
		navigator.geolocation.getCurrentPosition(successLocStart, errorLoc, optionsLoc);
	};

	this.endIntervention = function() {
		navigator.geolocation.getCurrentPosition(successLocEnd, errorLoc, optionsLoc);
	};

}

