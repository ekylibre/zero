

function Storage(){
	
	var date, lat, lon;
	
	this.create=function(lat,lon,date){
		alert("in");
		this.date=date;
		this.lat=lat;
		this.lon=lon;
		
	};
	
	function getDate(){
		return date;
	}
		
	function getLat(){
		return lat;
	}
	
	function getLon(){
		return lon;
	}
	
	function setLon(lon){
		this.lon=lon;	
	}
		
	function setLat(lat){
		this.lat=lat;
	}
	
	function setDate(){
		date=date;
	}
	
}