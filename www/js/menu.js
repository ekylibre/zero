function initialize() {
	$(document).ready(function() {
		var app=new App();
		app.initialize();
		
		$("#buttonFinish").hide();
		$("#buttonPause").hide();
		$("#buttonResume").hide();

		$("#buttonStart").click(function() {
			clock.start();
			$(this).hide();
			$("#buttonFinish").show();
			$("#buttonPause").show();
			app.startIntervention();
		});

		$("#buttonFinish").click(function() {
			clock.setTime(0);
			clock.stop();
			$("#buttonStart").show();
			$("#buttonPause").hide();
			$("#buttonResume").hide();
			$(this).hide();
			app.endIntervention();
		});
		
		$("#buttonPause").click(function() {
			clock.stop();
			$("#buttonResume").show();
			$(this).hide();
			app.pauseIntervention();
		});
		
		$("#buttonResume").click(function() {
			clock.start();
			$("#buttonPause").show();
			$(this).hide();
			app.resumeIntervention();
		});
	});
}



