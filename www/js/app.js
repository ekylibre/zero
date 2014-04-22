

function App(){
	
	var REFRESH_TIME=500;
	var lat,lon,date;
	var idStore=0;
	
	this.run=function(){
		var geoloc_interval = setInterval(location,REFRESH_TIME);
	};
	
	function location(){
		getLocation();
		storeLocation();
		printLocation();
	}
	
	function getLocation(){
		
		if (navigator.geolocation){
	      navigator.geolocation.getCurrentPosition(function(position){
		 	  lat = position.coords.latitude ; 
		 	  lon = position.coords.longitude ;
		 	  date= new Date();
		   });
		}
		else{
		  //	document.getElementById('affichage').innerHTML="Geolocation is not supported by this browser.";
		}
	}

	
	function storeLocation(){
		
		var data = {
			"latitude" : lat,
			"longitude" : lon,
			"date" : date.toString()
		};
	    var val = JSON.stringify(data);
	    window.localStorage.setItem(idStore, val);
		
	    idStore++;
	}
	
			
	function printLocation(){
		
		var key=idStore-1;
		var value = JSON.parse(window.localStorage.getItem(key));
		alert(value.latitude);
		document.getElementById('affichage').innerHTML
			= "Latitude = " + value["latitude"]
			+ "<br> Longitude = "+ value["longitude"]
			+ "<br> Date = "+ value["date"];
	}
}

