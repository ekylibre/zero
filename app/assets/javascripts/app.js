/*
  var app = {
  // Application Constructor
  initialize: function() {
  this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
  document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicity call 'app.receivedEvent(...);'
  onDeviceReady: function() {
  app.receivedEvent('deviceready');
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {
  var parentElement = document.getElementById(id);
  var listeningElement = parentElement.querySelector('.listening');
  var receivedElement = parentElement.querySelector('.received');

  listeningElement.setAttribute('style', 'display:none;');
  receivedElement.setAttribute('style', 'display:block;');

  console.log('Received Event: ' + id);
  }
  };
*/


function App() {

    var database = null;
    var geolocalizationIntervalDuration = 1000;
    var geolocalizationInterval = null;
    var activeMode;
    var running;
    var interventionName;

    var optionsLoc = {
	enableHighAccuracy: true,
	maximumAge: 0
    };

    this.initialize = function() {
	if (database == null) {
	    database = new Database();
	    database.create();
	    running = false;
	    database.writeInterventions();
	} else
	    console.log("Database already initialized");
	activeMode = false;
    };

    ///////////////////////////////////////
    function run() {
	if(navigator.geolocation)
	{ 
	    if (geolocalizationInterval == null) {
		geolocalizationInterval = setInterval(location, geolocalizationIntervalDuration);
	    }
	}
	else
	    alert("activez la geolocalisation");
    }

    function stop() {
	clearInterval(geolocalizationInterval);
	geolocalizationInterval = null;
    }

    function locationIsRunning() {
	return geolocalizationInterval != null;
    }


    this.activeMode = function() {
	return activeMode;
    };
    /////////////////////////////////////

    //Fonction appellée tous les geolocalizationIntervalDuration
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
	    database.storePoint(point, database.writeInterventions);
	else
	    database.storePoint(point);
    }


    this.showInterventions = function() {
	database.writeInterventions();
    };

    //////////////////////////////////////

    function successLocStart(pos) {
	createLocPoint(pos.coords, "start", interventionName);
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

    function errorLoc(error) {
	alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
    }

    function getCurrentPosition(successLocation) {
	navigator.geolocation.getCurrentPosition(successLocation, errorLoc, optionsLoc);
    }

    ////////////////////////////////////////

    this.pushData = function() {
	if (window.localStorage.getItem("user") != null)
	    database.send();
	else
	    $("#error-label").text("utilisateur non identifié");
    };

    //Creation des points
    //  url (String): URl de la pa ge à charger
    //params (Map): (optionnel) paires de clé/valeur qui seront envoyées au serveur.
    //callback (Fonction): (optionnel) fonction qui sera éxécutée dès que les données seront complètement chargées.

    ////////////////////////////////////////
    this.startIntervention = function(name) {
	interventionName = name;
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
	if (locationIsRunning() && !activeMode) {
	    activeMode = true;
	    getCurrentPosition(successLocActiveModeOn);
	}
    };

    this.activeModeOff = function() {
	if (locationIsRunning() && activeMode) {
	    activeMode = false;
	    getCurrentPosition(successLocActiveModeOff);
	}
    };
}

