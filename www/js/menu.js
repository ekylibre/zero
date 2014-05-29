function initApp() {
	document.addEventListener("deviceready", onDeviceReady, false);
}

function disconnection() {
	window.localStorage.clear("user");
	window.localStorage.clear("pwd");
	window.localStorage.clear("url");

	$("#authenticator").html("<img src='img/login.png' alt='start' width='75px' height='25px'/>");
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

		$("#intervention-pause").hide();

		//////Evenement sur les boutons natifs
		document.addEventListener("menubutton", onMenuKeyDown, false);
		document.addEventListener("backbutton", onBackKeyDown, false);
		document.addEventListener("endcallbutton", onEndCallKeyDown, false);

		/////////Gestion de l'icone de log'
		if (window.localStorage.getItem("user") != null) {
			$("#form-log").hide();
			$("#authenticator").html("<img src='img/logout.png' alt='start' width='75px' height='25px'/></br>");
		} else {
			$("#authenticator").html("<img src='img/login.png' alt='start' width='75px' height='25px'/>");
			$("#buttonDisconnection").hide();
		}

		$("nameOption").controlgroup({
			corners : false
		});

		////////gestion des Radio buttons

		$("#radio-Intervention").find("input[type='radio']").bind("change", function() {
			window.localStorage.setItem("saisie", this.value);
		});

		$("input[type='radio']").checkboxradio();
		switch (window.localStorage.getItem("saisie")) {
			case undefined :
				$('#radio-Intervention-Auto').attr("checked", true).checkboxradio("refresh");
				break;
			case "Auto":
				$("#radio-Intervention-Auto").attr("checked", true).checkboxradio("refresh");
				break;
			case "Write":
				$('#radio-Intervention-Write').attr("checked", true).checkboxradio("refresh");
				break;
			case "default":
				$('#radio-Intervention-Auto').attr("checked", true).checkboxradio("refresh");
				break;
		}

		//$("input[type='radio']").attr("checked", true).checkboxradio("refresh");
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


		$("#authenticator").click(function() {
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
		$("#intervention-stop").hide();
		$("#intervention-pause").hide();
		$("#intervention-resume").hide();
		$("#buttonActiveOff").hide();
		$("#buttonActiveOn").hide();

		$("#intervention-start").click(function() {
			switch (window.localStorage.getItem("saisie")) {
				case "Write" :
					window.location.href = "#name-choice";
					break;
				case "Auto" :
					$('#clock').countdown('destroy');
					createClock('#clock');
					//affichage de boutons
					$("#intervention-stop").show();
					$("#intervention-pause").show();
					$("#intervention-actions").show();
					// $("#buttonActiveOn").show();
					// $("#buttonActiveOff").hide();
					app.startIntervention();
					$('#active-work-clock').countdown('destroy');
					break;
				default :
					$('#clock').countdown('destroy');
					createClock('#clock');
					//affichage de boutons
					$("#intervention-stop").show();
					$("#intervention-pause").show();
					$("#intervention-actions").show();
					// $("#buttonActiveOn").show();
					// $("#buttonActiveOff").hide();
					app.startIntervention();
					$('#active-work-clock').countdown('destroy');
					break;
			}
		});

		$("#buttonInterventionNameSubmit").click(function() {
			if ($("#interventionTextName").val().length < 3) {
				alert("name length must be more than 3");
			} else {
				var int_name = $("#interventionTextName").val();
				$('#clock').countdown('destroy');
				createClock('#clock');
				//affichage de boutons
				$("#intervention-stop").show();
				$("#intervention-pause").show();
				$("#buttonActiveOn").show();
				$("#buttonActiveOff").hide();
				app.startIntervention(int_name);
				$('#active-work-clock').countdown('destroy');
				window.location.href = "#interventions";
			}
		});

		$("#intervention-stop").click(function() {
			$('#clock').countdown('destroy');
			//affichage de boutons
			$("#intervention-start").show();
			$("#intervention-pause").hide();
			$("#intervention-resume").hide();
			$("#intervention-actions").hide();
			$(this).hide();

			app.activeModeOff();
			$('#active-work-clock').countdown('destroy');
			app.endIntervention();
		});

		$("#intervention-pause").click(function() {
			//stop l'horloge
			$('#clock').countdown('toggle');
			//affichage des bouton
			$("#intervention-resume").show();
			$("#intervention-actions").hide();
			$(this).hide();
			//On met l'appli en pause'
			app.pauseIntervention();
		});

		$("#intervention-resume").click(function() {
			//On relance le compteur
			$('#clock').countdown('toggle');
			//affichage de boutons
			$("#intervention-pause").show();
			$(this).hide();
			if (app.activeMode()) {
				$("#buttonActiveOff").show();
			} else {
				$("#buttonActiveOn").show();
			}
			//relance l'appli'
			app.resumeIntervention();
		});

		$("#active-work").click(function() {
				var element = $(this);
				if (element.hasClass("active")) {
						$('#active-work-clock').countdown('destroy');
						element.removeClass("active");
						app.activeModeOff();
				} else {
						createClock("#active-work-clock");
						element.addClass("active");
						app.activeModeOn();				
				}
		});
/*
		$("#buttonActiveOn").click(function() {
			createClock("#active-work-clock");
			$("#buttonActiveOn").hide();
			$("#buttonActiveOff").show();
			app.activeModeOn();
		});

		$("#buttonActiveOff").click(function() {
			$('#active-work-clock').countdown('destroy');
			$("#buttonActiveOff").hide();
			$("#buttonActiveOn").show();
			app.activeModeOff();
		});
*/
		$("#crumbs-sync").click(function() {
			app.pushData();
		});

		$("#buttonSubmitLogin").click(function() {
			if ($("#user").val().length < 3 || $("#pwd").val().length < 3)
				$("#login-errors").text("identifiant ou mot de passe invalide");
			else {
				if ($("#url").val() == "local")
					$("#url").val() = "localhost:3000/api/v1/crumbs";

				var my_url = $("#url").val();

				$.post(my_url, ( {
					user : $("#user").val(),
					pass : $("#pwd").val()
				}
				), function(data) {
					alert("connect");
					if (data != "") {
						window.localStorage.setItem("user", $("#user").val());
						window.localStorage.setItem("pwd", $("#pwd").val());
						window.localStorage.setItem("url", $("#url").val());
						alert("connection ok");
						$("#form-log").hide();
						$("#buttonDisconnection").show();
						$("#authenticator").html("<img src='img/logout.png' alt='start' width='75px' height='25px'/>");
						$.mobile.changePage('#interventions', {
							transition : "flip",
							reverse : false,
							changeHash : false
						});
					} else {
						$("login-errors").text("identifiant ou mot de passe invalide");
						alert("could not connect");
					}
				}, 'json');
			}
		});


		$("#options-edit").click(function() {
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
			$("#authenticator").html("<img src='img/login.png' alt='start' width='75px' height='25px'/>");
		});

		$("#buttonBack").click(function() {
			$.mobile.changePage('#interventions', {
				transition : "flip",
				reverse : false,
				changeHash : false
			});
		});

		$("#barcode-scan").click(function() {
			alert('scanning');
			var scanner = cordova.require("cordova/plugin/BarcodeScanner");
			scanner.scan(function(result) {
				alert("We got a barcode\n" + "Result: " + result.text + "\n" + "Format: " + result.format + "\n" + "Cancelled: " + result.cancelled);
			}, function(error) {
				alert("Scanning failed: " + error);
			});
		});
	});
}
