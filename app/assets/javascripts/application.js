/*
 *= require jquery
 *= require jquery.mobile  
 *= require jquery.plugin
 *= require jquery.countdown
 */

var app = {

    database: null,
    refreshTime: 1000,
    
    initialize: function () {
	
	// Search token. If no token, ask for authentication
	
    }

};

document.addEventListener("deviceready", function () {
    console.log("Device ready!");
    app.initialize();
}, false);
