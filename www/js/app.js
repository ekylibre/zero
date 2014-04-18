

function App(){
	
	
	var REFRESH_TIME=500;
	var lat,lon;
	
	
	var id=-1;
	var t=new Array("Date","Latitude","Longitude");
	
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
		 	  
		  });
		}
		else{
		  //	document.getElementById('affichage').innerHTML="Geolocation is not supported by this browser.";
		}
	}
		
	function printLocation(){
		document.getElementById('affichage').innerHTML 
			= "Latitude = " + window.localStorage.getItem(id).getLat();
			+ "<br> Longitude = "+ window.localStorage.getItem(id).getLon();
			+ "<br> Date = "+ window.localStorage.getItem(id).getDate();
	}
	
	function storeLocation(){
		s=new Storage();
		s.create(lat,lon,date);
		id++;
		window.localStorage.set(id,s);
	}
}

