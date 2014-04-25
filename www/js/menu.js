$(document).ready(function() {
	$("#buttonFinish").hide();
	
	
	$("#buttonStart").click(function() {
		$(this).hide();
		$("#buttonFinish").show();
	});
	
	$("#buttonFinish").click(function() {
		$("#buttonStart").show();
		$(this).hide();
	});
});

var app;

function initialize() {
	bindEvents();
}

function bindEvents() {
	document.addEventListener('deviceready', this.onDeviceReady, false);
}

function onDeviceReady() {
	document.getElementById('buttonStartIntervention').addEventListener('click', startInterventionClicked, false);
	document.getElementById('buttonFinishIntervention').addEventListener('click', finishInterventionClicked, false);

	app = new App();
	app.initialize();
}

function startInterventionClicked() {
	app.startIntervention();
}

function finishInterventionClicked() {
	app.endIntervention();
}
