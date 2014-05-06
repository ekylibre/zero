function initialize() {
	$(document).ready(function() {
		//Initialisation de l'appli
		var app = new App();
		app.initialize();

		document.addEventListener("menubutton", onMenuKeyDown, false);
		document.addEventListener("backbutton", onBackKeyDown, false);
		//Initialisation de l'horloge
		function createClock() {
			$('#clock').countdown({
				since : new Date(),
				format : 'HMS',
				description : ' ',
				compact : true
			});
			$('#clock').countdown('pause');
		}

		function onMenuKeyDown() {
			$.mobile.changePage('#config', 'flip', true, true);
		}

		function onBackKeyDown() {
			$.mobile.changePage('#interventions', 'flip', true, true);
		}

		createClock();
		//affichage de boutons
		$("#buttonFinish").hide();
		$("#buttonPause").hide();
		$("#buttonResume").hide();
		$("#buttonActiveOff").hide();
		$("#buttonActiveOn").hide();

		$("#buttonStart").click(function() {
			$('#clock').countdown('toggle');
			$(this).hide();
			//affichage de boutons
			$("#buttonFinish").show();
			$("#buttonPause").show();
			$("#buttonActiveOn").show();
			app.startIntervention();
		});

		$("#buttonFinish").click(function() {
			$('#clock').countdown('destroy');
			createClock();

			//affichage de boutons
			$("#buttonStart").show();
			$("#buttonPause").hide();
			$("#buttonResume").hide();
			$("#buttonActiveOff").hide();
			$("#buttonActiveOn").hide();
			$(this).hide();

			app.activeModeOff();
			app.endIntervention();
		});

		$("#buttonPause").click(function() {
			//stop l'horloge
			$('#clock').countdown('toggle');
			//affichage des bouton
			$("#buttonResume").show();
			$("#buttonActiveOff").hide();
			$("#buttonActiveOn").hide();
			$(this).hide();
			//On met l'appli en pause'
			app.pauseIntervention();
		});

		$("#buttonResume").click(function() {
			//On relance le compteur
			$('#clock').countdown('toggle');
			//affichage de boutons
			$("#buttonPause").show();
			$(this).hide();
			if (app.activeMode()) {
				$("#buttonActiveOff").show();
			} else {
				$("#buttonActiveOn").show();
			}
			//relance l'appli'
			app.resumeIntervention();
		});

		$("#buttonActiveOn").click(function() {
			$("#buttonActiveOn").hide();
			$("#buttonActiveOff").show();
			app.activeModeOn();
		});

		$("#buttonActiveOff").click(function() {
			$("#buttonActiveOff").hide();
			$("#buttonActiveOn").show();
			app.activeModeOff();
		});
	});
}

