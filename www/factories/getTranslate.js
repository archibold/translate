angular.module('getTranslateFactory', ['DB'])

.factory('getTranslate', function($q, DB) {
	var indexAt = 0;
	return {
		getNext: function(type, language){
			var def = $q.defer();
			DB.getByLanguage(type, language).then(function(result){
				indexAt = indexAt <= result.length -1? indexAt : 0;
				if(result[indexAt] != undefined){
					result[indexAt].wordsLeft = result.length;
				}
				def.resolve(result[indexAt]);
				indexAt++;
			}, function(err){
				console.log(err)
			})
			return def.promise;
		},
		levelUp: function(type, id, language){
			var def = $q.defer();
			DB.levelUp(type, id, language).then(function(result){
				indexAt = indexAt <= result.length -1? indexAt : 0;
				if(result[indexAt] != undefined){
					result[indexAt].wordsLeft = result.length;
				}
				def.resolve(result[indexAt]);
				indexAt++;
			},function(err){
				console.log(err);
			})
			return def.promise;
		},
		reset: function(){
			var def = $q.defer();
			DB.reset().then(function(res){
				def.resolve(res);
			}, function(err){
				console.log(err);
			})
			return def.promise;
		}
	}
})
