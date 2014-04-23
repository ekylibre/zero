//Lancer la base
function Database() {
	var db = openDatabase("database", "1", "database", 65536);

	this.init = function() {
		var query = "CREATE TABLE IF NOT EXISTS points (name, latitude, longitude, date, accuracy, type, code, quantity, unit)";
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

	this.dropTable = function() {
		db.transaction(function(tx) {
			tx.executeSql('DROP TABLE IF EXISTS points');
		});
	};

	this.storePoint = function(point) {
		if (point != undefined) {
			var query = "INSERT INTO points (latitude,longitude,date,accuracy,type) VALUES (?,?,?,?,?);";
			db.transaction(function(tx) {
				tx.executeSql(query, [point.latitude, point.longitude, point.date, point.accuracy, 'point'], function(tx, result) {
					console.log("Query Success");
				});
			}, function(error) {
				console.log("Transaction Error: " + error.message);
			}, function() {
				console.log("Transaction Success : ajout Point");
			});
		}
	};

	//Appelle la fonction printSuccess
	this.afficher = function(cpt) {
		db.transaction(function(tx) {
			tx.executeSql("SELECT COUNT(*) as count FROM points", [], function(tx, result) {
				for (var i = 0; i < result.rows.length; ++i) {
					var row = result.rows.item(i);
					console.log("  " + row.latitude + " " + row.longitude + " " + row.accuracy);
				}
			});
		}, function(error) {
			console.log("Transaction Error: " + error.message);
		}, function() {
			console.log("Transaction Success");
		});
	};

	function querySuccessDefault(tx, result) {
		console.log("Query Success");
	}

	function queryFailDefault(tx, error) {
		console.log("Query Error: " + error.message);
	}

}
