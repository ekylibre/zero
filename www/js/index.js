
var app = {
	// Application Constructor
	initialize : function() {
		this.bindEvents();
	},

	bindEvents : function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	onDeviceReady : function() {
		window.location = 'app.html';
	}
};
