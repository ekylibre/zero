//Lancer la base
function Database() {
    var db;
    var date_options = {
	formatLength : 'short',
	selector : 'date and time'
    };

    this.create = function() {
	db = openDatabase("base_test11", "", "database", 65536);
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

    //////////////////////////////////////////////////////////////

    //Creation de la table des points
    function affichage() {
	var query = "SELECT * from points;"//Creation de la table POINTS
	db.transaction(function(tx) {
	    tx.executeSql(query, [], function(tx, rs) {
		for (var i = 0; i < rs.rows.length; i++) {
		    var row = rs.rows.item(i)
		    console.log(row['latitude']);

		}
	    }, function(error) {
		console.log("Transaction Error: " + error.message);
	    });
	});
    }

    //On efface la table Point
    function dropTablePoints() {
	db.transaction(function(tx) {
	    tx.executeSql('DROP TABLE IF EXISTS points');
	});
    };

    //////////////////////////////////////////////////////////////

    //Ajoute une entrée a partir d'un point {latitude,longitude,date,accuracy}
    this.storePoint = function(point, write) {
	if (point != undefined) {
	    var query = "INSERT INTO points (name,latitude,longitude,date,accuracy,type,code,quantity,unit) VALUES (?,?,?,?,?,?,?,?,?);";
	    db.transaction(function(tx) {
		tx.executeSql(query, [point.name, point.latitude, point.longitude, point.date, point.accuracy, point.type, point.code, point.quantity, point.unit], function(tx, result) {
		    console.log("Query Success");
		});
		if (point.type == 'end' || point.type == 'start')
		    write();
	    }, function(error) {
		console.log("Transaction Error: " + error.message);
	    }, function() {
		console.log("Transaction Success : ajout Point");
	    });
	}
    };

    //Ecrit le tableau des interventions
    //On prend les lignes 2 par 2 pour faire la difference des dates, afin d'obtenir la durée de l'intervention
    this.writeInterventions = function() {
	var query = "SELECT * from points where type in ('start', 'end')";
	//Creation de la table POINTS
	$('#interventions-list').html("<thead><tr><th>Title</th><th>Duration</th><th>Begining</th></tr></thead><tbody>");
	db.transaction(function(tx) {
	    tx.executeSql(query, [], function(tx, rs) {
		var i = 0;
		var num_int = 1;
		while (i < rs.rows.length - 1) {
		    var row1 = rs.rows.item(i);
		    var row2 = rs.rows.item(i + 1);
		    date1 = new Date(row1.date);
		    date2 = new Date(row2.date);

		    var name;
		    if (row1.name == "undefined") {
			name = "int n° " + num_int;
		    } else {
			name = row1.name;
		    }
		    var duree = new Date(date2.getTime() - date1.getTime());
		    duree.setTime(duree.getTime() + (duree.getTimezoneOffset() * 1000 * 60));
		    $('#interventions-list').append("<tr><th>" + name + "</th><td>" + time_format(duree) + "</td><td>" + formattedDate(date1) + "</td></tr>");
		    if (row2.type == 'end') {
			i += 2;
		    } else {
			row1 = row2;
			i++;
		    }
		    num_int++;
		}
		$('#interventions-list').append("</tbody>");
		//	table.find("thead").html(thead);
	    }, function(error) {
		console.log("Transaction Error: " + error.message);
	    });
	});
    };

    //Create a JSON objects with an array of points. each element of the array contains an object with points table column names as attributs
    this.send = function() {
	var points = new Array();
	//On recupere tous les points
	var query = "SELECT * from points;";
	db.transaction(function(tx) {
	    tx.executeSql(query, [], function(tx, rs) {//success function
		for ( i = 0; i < rs.rows.length; i++) {
		    var row = rs.rows.item(i);
		    var point = {
			"name" : row["name"],
			"latitude" : row["latitude"],
			"longitude" : row["longitude"],
			"date" : row["date"],
			"accuracy" : row["accuracy"],
			"type" : row["type"],
			"code" : row["code"],
			"quantity" : row["quantity"],
			"unit" : row["unit"]
		    };
		    points.push(point);
		}
		var obj = {
		    id : window.localStorage.getItem("user"),
		    passwrd : window.localStorage.getItem("pwd"),
		    points : this.points
		};
		$.ajax({
		    type : "POST",
		    url : my_url,
		    data : obj,
		    dataType : "json",
		    success : function(data) {
			console.log("send success");
		    },
		    error : function(data) {
			console.log("send error");
			console.log(data);
		    }
		});
	    }, function(error) {// fonction d'erreur
		console.log("Transaction Error: " + error.message);
	    });
	});
    };
    ////////////////////////////////////////////////////////////////

    function formattedDate(date) {
	var d = new Date(date || Date.now()), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
	if (month.length < 2)
	    month = '0' + month;
	if (day.length < 2)
	    day = '0' + day;

	return [day, month, year].join('/');
    }

    function time_format(d) {
	hours = format_two_digits(d.getHours());
	minutes = format_two_digits(d.getMinutes());
	seconds = format_two_digits(d.getSeconds());
	return hours + ":" + minutes + ":" + seconds;
    }

    function format_two_digits(n) {
	return n < 10 ? '0' + n : n;
    }

    /////////////////////////////////////////////////////////////////

    /*	this.checkLastPoint = function() {
	var query = "SELECT * from points where id = MAX(Select id from points);";
	db.transaction(function(tx) {
	tx.executeSql(query, [], function(tx, rs) {
	if (!rs.rows.item(0).type == 'end') {
	$.mobile.changePage('#close-error', 'flip', true, true);
	}
	}, function(error) {
	alert(error);
	console.log("Transaction Error: " + error.message);
	});
	});
	};*/

    function querySuccessDefault(tx, result) {
	console.log("Query Success");
    }

    function queryFailDefault(tx, error) {
	console.log("Query Error: " + error.message);
    }

}
