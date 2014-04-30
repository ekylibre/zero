//Lancer la base
function Database() {
	var db;

	this.create = function() {
		db = openDatabase("Rey_database", "", "database", 65536);

		////////Migration
		var M = new Migrator(db);
		M.migration(1, function(t) {
			t.executeSql("CREATE TABLE IF NOT EXISTS points (id INTEGER PRIMARY KEY AUTOINCREMENT,name, latitude FLOAT, longitude FLOAT , date DATE, accuracy NUMERIC, type TEXT, code TEXT, quantity NUMERIC, unit TEXT)");
		});
	/*	M.migration(2, function(t) {
			t.executeSql("CREATE TABLE IF NOT EXISTS pointsss (id INTEGER PRIMARY KEY AUTOINCREMENT,name, latitude FLOAT, longitude FLOAT , date DATE, accuracy NUMERIC, type TEXT, code TEXT, quantity NUMERIC, unit TEXT)");
		});*/
		//	M.migration(3, function(t) {
		//		t.executeSql("create table foo2...");
		//	});
		M.doIt();

		///////Test
	};

	//Creation de la table des points
	function createTable() {
		var query = "CREATE TABLE IF NOT EXISTS points (id INTEGER PRIMARY KEY AUTOINCREMENT,name, latitude FLOAT, longitude FLOAT , date DATE, accuracy NUMERIC, type TEXT, code TEXT, quantity NUMERIC, unit TEXT);";
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
			var query = "INSERT INTO points (name,latitude,longitude,date,accuracy,type,code,quantity,unit) VALUES (?,?,?,?,?,?,?,?,?);";

			db.transaction(function(tx) {
				tx.executeSql(query, [point.name, point.latitude, point.longitude, point.date, point.accuracy, point.type, point.code, point.quantity, point.unit], function(tx, result) {
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
