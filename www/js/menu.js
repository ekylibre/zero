function onLoad() {
	document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
	$(document).ready(function() {
		document.addEventListener("deviceready", onDeviceReady, false);
		//Initialisation de l'appli
		var app = new App();
		app.initialize();
		document.addEventListener("menubutton", onMenuKeyDown, false);
		document.addEventListener("backbutton", onBackKeyDown, false);
		document.addEventListener("endcallbutton", onEndCallKeyDown, false);
		//Initialisation de l'horloge
		function createClock(clock) {
			$(clock).countdown({
				since : new Date(),
				format : 'HMS',
				description : ' ',
				compact : true
			});
		}

		function onMenuKeyDown() {
			$.mobile.changePage('#config', {
				transition : "flip",
				reverse : false,
				changeHash : false
			});
		}

		function onBackKeyDown() {
			$.mobile.changePage('#interventions', {
				transition : "flip",
				reverse : false,
				changeHash : false
			});
		}

		function onEndCallKeyDown() {
			if (app.running) {
				app.endIntervention();
			}
		}


		$('#clock').countdown('pause');
		//affichage de boutons
		$("#buttonFinish").hide();
		$("#buttonPause").hide();
		$("#buttonResume").hide();
		$("#buttonActiveOff").hide();
		$("#buttonActiveOn").hide();

		$("#buttonStart").click(function() {
			$('#clock').countdown('destroy');
			createClock('#clock');
			//affichage de boutons
			$("#buttonFinish").show();
			$("#buttonPause").show();
			$("#buttonActiveOn").show();
			$("#buttonActiveOff").hide();
			app.startIntervention();
			$('#clockActiveMode').countdown('destroy');
		});

		$("#buttonFinish").click(function() {
			$('#clock').countdown('destroy');
			//affichage de boutons
			$("#buttonStart").show();
			$("#buttonPause").hide();
			$("#buttonResume").hide();
			$("#buttonActiveOff").hide();
			$("#buttonActiveOn").hide();
			$(this).hide();

			app.activeModeOff();
			$('#clockActiveMode').countdown('destroy');
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
			createClock("#clockActiveMode");
			$("#buttonActiveOn").hide();
			$("#buttonActiveOff").show();
			app.activeModeOn();
		});

		$("#buttonActiveOff").click(function() {
			$('#clockActiveMode').countdown('destroy');
			$("#buttonActiveOff").hide();
			$("#buttonActiveOn").show();
			app.activeModeOff();
		});
	});
}
