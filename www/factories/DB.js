angular.module('DB',['ngCordova'])
.factory('DB', function($q, $cordovaSQLite, $ionicPlatform, $http) {
	var DB = function(){
		var def = $q.defer();
			$ionicPlatform.ready(function() {
				//select device
			  	var db = null;
				if (window.cordova) {
			    	db = $cordovaSQLite.openDB({ name: "translate.db" }); //device
			    }else{
			     	db = window.openDatabase("translate.db", '1', 'translate', 1024 * 1024 * 100); // browser
			    }

			    //create table
				$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS translate (id integer primary key, polish text, english text, spanish text, typeEnglish integer, typeSpanish integer)")
				def.resolve(db);
				// $cordovaSQLite.execute(db, "DROP TABLE translate").then(
				// 	function(res){console.log(res)}, function(err){console.log(err)});
			})
		return def.promise;
	}

	
  	return {
  		update: function(){
  			DB().then(function(db){
	  			//check for updates
	  			$cordovaSQLite.execute(db, "SELECT * FROM translate").then(function(res){
	  				//get form spreadsheet
	  				$http.get('https://spreadsheets.google.com/feeds/list/1Jwm1ubBa2YWc2JhV4XNJm_9IuIDQaNXykdZTFx627hI/od6/public/values?alt=json').then(function(result){
							var data = result.data.feed.entry;
							for(var i = res.rows.length ; i< data.length; i++){
								//insert to DB
								query = "INSERT INTO translate (polish, english, spanish, typeEnglish, typeSpanish) VALUES (?,?,?,?,?)";
								var polish =data[i].gsx$polish.$t;
								var english =data[i].gsx$english.$t;
								var spanish = data[i].gsx$spanish.$t;
								var typeEnglish = 0;
								var typeSpanish = 0;
					            $cordovaSQLite.execute(db, query, [polish, english, spanish, typeEnglish, typeSpanish]).then(function(res){
					                console.log('UPDATE OK')
					            }, function(err){
					            	console.log(err.message);
					            });
							}
					}, function(err){
						console.log(err);
					})

	  			})
  			}, function(err){
  				console.log(err)
  			})
  		},
  		reset: function(){
  			var def = $q.defer();
  			DB().then(function(db){
	  			//check for updates
	  			$cordovaSQLite.execute(db, "SELECT * FROM translate").then(function(res){

	  				$cordovaSQLite.execute(db, "DELETE FROM translate", []).then(function(res){
		                console.log('DELETE OK')
		            }, function(err){
		            	console.log(err.message);
		            });
	  				//get form spreadsheet
	  				$http.get('https://spreadsheets.google.com/feeds/list/1Jwm1ubBa2YWc2JhV4XNJm_9IuIDQaNXykdZTFx627hI/od6/public/values?alt=json').then(function(result){
							var data = result.data.feed.entry;
							for(var i = 0 ; i< data.length; i++){
								//insert to DB
								query = "INSERT INTO translate (polish, english, spanish, typeEnglish, typeSpanish) VALUES (?,?,?,?,?)";
								var polish =data[i].gsx$polish.$t;
								var english =data[i].gsx$english.$t;
								var spanish = data[i].gsx$spanish.$t;
								var typeEnglish = 0;
								var typeSpanish = 0;
					            $cordovaSQLite.execute(db, query, [polish, english, spanish, typeEnglish, typeSpanish]).then(function(res){
					                console.log('OK')
					            }, function(err){
					            	console.log(err.message);
					            });
							}
							def.resolve("RESET OK");
					}, function(err){
						console.log(err);
					})

	  			})
  			}, function(err){
  				console.log(err)
  			})
			return def.promise;
  		},
  		getAll: function(){
  			var def = $q.defer();
  			DB().then(function(db){
  				var query = "SELECT * FROM translate";
	  			$cordovaSQLite.execute(db, query, []).then(function(res){
	  				data = [];
	  				for(var i=0; i< res.rows.length; i++){
	  					data.push({
	  						id: res.rows.item(i).id,
	  						word: res.rows.item(i).english,
	  						translate: res.rows.item(i).polish
	  					})
	  				}
	  				def.resolve(data);
	         //       console.log(data);
	            }, function(err){
	            	console.log(err);
	            });
  			}, function(err){
  				console.log(err);
  			})
  			return def.promise;
  		},

  		getByLanguage: function(type, language){
  			var def = $q.defer();
  			DB().then(function(db){
  				var query;
  				if(language == 'en'){
					query = "SELECT * FROM translate WHERE typeEnglish = ?";
  				}else{
  					 query = "SELECT * FROM translate WHERE typeSpanish = ?";
  				}
	  			$cordovaSQLite.execute(db, query, [type]).then(function(res){
	                data = [];
	  				for(var i=0; i< res.rows.length; i++){
	  					data.push({
	  						id: res.rows.item(i).id,
	  						translate: res.rows.item(i).polish,
	  						//TODO!!!!
	  						word: (language == 'en')?res.rows.item(i).english: res.rows.item(i).spanish
	  					})
	  				}
	  				def.resolve(data);
	  				//console.log(data);
	            }, function(err){
	            	console.log(err);
	            });
  			}, function(err){
  				console.log(err);
  			})
  			return def.promise;
  		},
  		levelUp: function(type, id, language){
  			var def = $q.defer();
  			DB().then(function(db){
				var query ="";
				if(language == "en"){
					query = "UPDATE translate SET typeEnglish=typeEnglish+1 WHERE id = ?";
				}else{
					query = "UPDATE translate SET typeSpanish=typeSpanish+1 WHERE id = ?";
				}
				$cordovaSQLite.execute(db, query, [id]).then(function(res){
					console.log(res);
					query = "SELECT * FROM translate WHERE typeEnglish = ?";
					$cordovaSQLite.execute(db, query, [type]).then(function(res){
						data = [];
		  				for(var i=0; i< res.rows.length; i++){
		  					data.push({
		  						id: res.rows.item(i).id,
		  						translate: res.rows.item(i).polish,
		  						word: res.rows.item(i).english
		  					})
		  				}
		  				console.log(data);
		  				def.resolve(data);
		  			}, function(err){
		  				console.log(err)
		  			})
				}, function(err){
					console.log(err);
				})

				
			}, function(err){
				console.log(err)
			})
  			return def.promise;
  		}
  	}
  })