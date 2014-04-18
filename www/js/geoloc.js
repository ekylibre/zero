

function App(){
	
	
	var REFRESH_TIME=500;
	var lat,lon;
	
	this.run=function(){
		var geoloc_interval = setInterval(getLocation,REFRESH_TIME);
	};
	
	function location(){
		getLocation();
		printLocation();
	}
	
	function getLocation(){
		if (navigator.geolocation){
	      navigator.geolocation.getCurrentPosition(function(position){
		 	  lat = position.coords.latitude ; 
		 	  lon = position.coords.longitude ;
		 	  
		  });
		}
		else{
		  //	document.getElementById('affichage').innerHTML="Geolocation is not supported by this browser.";
		}
	}
		
	function printLocation(){
		//document.getElementById('affichage').innerHTML = "Latitude = " + lat + "<br> Longitude = "+ lon ;
	}
}

