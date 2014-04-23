//Lancer la base
function Database() {
	var db = openDatabase("database", "1", "database", 65536);


//Creation de la table des points
	this.init = function() {
		var query = "CREATE TABLE IF NOT EXISTS points (id INTEGER PRIMARY KEY AUTOINCREMENT,name, latitude FLOAT, longitude FLOAT , date DATE, accuracy NUMERIC, type TEXT, code TEXT, quantity NUMERIC, unit TEXT, intervention_id NUMERIC)";
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
	};

//On efface la table Point
	this.dropTablePoints = function() {
		db.transaction(function(tx) {
			tx.executeSql('DROP TABLE IF EXISTS points');
		});
	};

//Ajoute une entrée a partir d'un point {latitude,longitude,date,accuracy}
	this.storePoint = function(point) {
		if (point != undefined) {
			var query = "INSERT INTO points (latitude,longitude,date,accuracy,type,intervention_id) VALUES (?,?,?,?,?,?);";
			db.transaction(function(tx) {
				tx.executeSql(query, [point.latitude, point.longitude, point.date, point.accuracy,'point',point.intervention], function(tx, result) {
					console.log("Query Success");
				});
			}, function(error) {
				console.log("Transaction Error: " + error.message);
			}, function() {
				console.log("Transaction Success : ajout Point");
			});
		}
	};

	/*//Appelle la fonction printSuccess
	this.afficher = function() {
		var result=[];
		
		db.transaction(function(tx) {
			tx.executeSql("SELECT COUNT(*) as count FROM points", [], function(tx, result) {
				for (var i = 0; i < result.rows.length; ++i) {
					var row = result.rows.item(i);
					result[i]={
						lat : row['latitude'],
						lon : row['longitude'],
						acc : row['accuracy']
					};
				}
			});
		}, function(error) {
			console.log("Affichage Error: " + error.message);
		}, function() {
			console.log(result);
			callback(result);
		});
	};*/

	function querySuccessDefault(tx, result) {
		console.log("Query Success");
	}

	function queryFailDefault(tx, error) {
		console.log("Query Error: " + error.message);
	}

}
