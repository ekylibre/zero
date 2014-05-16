function onLoad() {
	document.addEventListener("deviceready", onDeviceReady, false);
}

function disconnection() {
	window.localStorage.clear("user");
	window.localStorage.clear("pwd");
	window.localStorage.clear("url");

	$("#isLogged").html("<img src='img/login.png' alt='start' width='75px' height='25px'/>");
	$("#buttonDisconnection").hide();
	$("#form-log").show();
	window.location("#interventions");
}

function onDeviceReady() {
	$(document).ready(function() {
		
		document.removeEventListener("deviceready", onDeviceReady, false);
		//Initialisation de l'appli
		var app = new App();
		app.initialize();
		
		document.addEventListener("menubutton", onMenuKeyDown, false);
		document.addEventListener("backbutton", onBackKeyDown, false);
		document.addEventListener("endcallbutton", onEndCallKeyDown, false);

		if (window.localStorage.getItem("user") != null) {
			$("#form-log").hide();
			$("#isLogged").html("<img src='img/logout.png' alt='start' width='75px' height='25px'/></br>");
		} else {
			$("#isLogged").html("<img src='img/login.png' alt='start' width='75px' height='25px'/>");
			$("#buttonDisconnection").hide();
		}

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

		$("#isLogged").click(function() {
			if (window.localStorage.getItem("user") != null) {
				disconnection();
			} else {
				$.mobile.changePage('#config', {
					transition : "flip",
					reverse : false,
					changeHash : false
				});
			}
		});

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

		$("#buttonSend").click(function() {
			app.pushData();

		});

		$("#buttonSubmit").click(function() {
			if ($("#user").val().length < 3 || $("#pwd").val().length < 3) {
				$("#errorLogLabel").text("identifiant ou mot de passe invalide");
			} else {
				var user = $("#user").val();
				var pwd = $("#pwd").val();
				var url = $("#url").val();
				window.localStorage.setItem("user", $("#user").val());
				window.localStorage.setItem("pwd", $("#pwd").val());
				window.localStorage.setItem("url", $("#url").val());
				$("#form-log").hide();
				$("#buttonDisconnection").show();
				$("#isLogged").html("<img src='img/logout.png' alt='start' width='75px' height='25px'/>");
				$.mobile.changePage('#interventions', {
					transition : "flip",
					reverse : false,
					changeHash : false
				});
			}
			/*$.post(url, {
			 "pseudo" : user,
			 "pass" : pwd
			 }, function(msg) {
			 if (msg.indexOf("erreur") >= 0) {
			 $("errorLogLabel").text("identifiant ou mot de passe invalide");
			 } else {

			 }
			 });*/
		});

		$("#buttonMenu").click(function() {
			$.mobile.changePage('#config', {
				transition : "flip",
				reverse : false,
				changeHash : false
			});
		});

		$("#buttonDisconnection").click(function() {
			window.localStorage.removeItem("user");
			window.localStorage.removeItem("pwd");
			window.localStorage.removeItem("url");
			$("#form-log").show();
			$("#buttonDisconnection").hide();
			$("#isLogged").html("<img src='img/login.png' alt='start' width='75px' height='25px'/>");
		});
		$("#buttonBack").click(function() {
			$.mobile.changePage('#interventions', {
				transition : "flip",
				reverse : false,
				changeHash : false
			});
		});
	});
}
