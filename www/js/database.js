//Lancer la base
function Database() {
	var db;

	this.create=function(){
		db = openDatabase("database", "1", "database", 65536);
		dropTablePoints();
		createTable();
	};
	
//Creation de la table des points
	function createTable () {
		var query = "CREATE TABLE IF NOT EXISTS points (id INTEGER PRIMARY KEY AUTOINCREMENT,name, latitude FLOAT, longitude FLOAT , date DATE, accuracy NUMERIC, type TEXT, code TEXT, quantity NUMERIC, unit TEXT)";
		//Creation de la table POINTS 
		db.transaction(function(tx) {
			tx.executeSql(query, [], function(tx, result) {
			});
		}, function(error) {
			console.log("Transaction Error: " + error.message);
		}, function() {
			console.log("Table created");
			console.log("Transaction Success");
		});
	}

//On efface la table Point
	function dropTablePoints() {
		db.transaction(function(tx) {
			tx.executeSql('DROP TABLE IF EXISTS points');
		});
	};

//Ajoute une entrée a partir d'un point {latitude,longitude,date,accuracy}
	this.storePoint = function(point) {
		if (point != undefined) {
			var query = "INSERT INTO points (latitude,longitude,date,accuracy,type) VALUES (?,?,?,?,?);";
			db.transaction(function(tx) {
				tx.executeSql(query, [point.latitude, point.longitude, point.date, point.accuracy,point.type], function(tx, result) {
					console.log("Query Success");
				});
			}, function(error) {
				console.log("Transaction Error: " + error.message);
			}, function() {
				console.log("Transaction Success : ajout Point");
			});
		}
	};

	function querySuccessDefault(tx, result) {
		console.log("Query Success");
	}

	function queryFailDefault(tx, error) {
		console.log("Query Error: " + error.message);
	}

}
