function initialize() {
	$(document).ready(function() {
		var app=new App();
		app.initialize();
		
		$("#buttonFinish").hide();

		$("#buttonStart").click(function() {
			$(this).hide();
			$("#buttonFinish").show();
			app.startIntervention();
		});

		$("#buttonFinish").click(function() {
			$("#buttonStart").show();
			$(this).hide();
			app.endIntervention();
		});
	});
}