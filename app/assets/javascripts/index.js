// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
// except 'app' ones,
requirejs.config({
    "baseUrl": "js/lib",
    "paths": {
	"app": "../app",
    },
    "shim": {
	jquery: "jquery",
        "jquery.mobile": ["jquery"],
        "jquery.plugin": ["jquery"],
        "jquery.countdown": ["jquery"]
    }
});

// Load the main app module to start the app
//requirejs(["app/menu"]);

require(["app/app"], function (app) {

    document.addEventListener("deviceready", function () {
	console.log("Device ready!");
	app.initialize();
    }, false);
    
});
