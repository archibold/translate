angular.module('translateCtrl', ['getTranslateFactory', 'DB'])

.controller('translateController', function($scope, getTranslate, DB) {
	$scope.level = 0;
	$scope.data = {};
	$scope.translate = false;
	$scope.language = 'en'
	$scope.menu = false;
	getTranslate.getNext($scope.level, $scope.language).then(function(result){
		if(result!=undefined){
				$scope.nothing = false;
				$scope.data = result;
			}else{
				$scope.nothing = true;
				$scope.data= {
					word: 'nothing here'
				}
			}
	})
	$scope.getNext = function(){
		getTranslate.getNext($scope.level, $scope.language).then(function(result){
			$scope.data = {};
			$scope.translate = false;
			$scope.data = result;
		})
	}
	$scope.levelUp = function(id){
		getTranslate.levelUp($scope.level, id, $scope.language).then(function(result){
			console.log(result);
			$scope.data = {};
			$scope.translate = false;
			if(result!=undefined){
				$scope.nothing = false;
				$scope.data = result;
			}else{
				$scope.nothing = true;
				$scope.data= {
					word: 'go to next level',
				}
			}
		})
	 }

	$scope.changeLevel = function(level){
		$scope.level = level;

		getTranslate.getNext(level, $scope.language).then(function(result){
			$scope.translate = false;
			if(result!=undefined){
				$scope.nothing = false;
				$scope.data = result;
			}else{
				$scope.nothing = true;
				$scope.data= {
					word: 'nothing here'
				}
			}
		})
	}

	$scope.translateWord = function(){
		if(!$scope.nothing && !$scope.menu){
			$scope.translate = !$scope.translate;
		}
	}

	$scope.changeToEnglish = function(){
		$scope.language = 'en';
		$scope.changeLevel(0);
		$scope.menu = false;
	}

	$scope.changeToSpanish = function(){
		$scope.language = 'sp';
		$scope.changeLevel(0);
		$scope.menu = false;
	}

	$scope.reset = function(){
		getTranslate.reset().then(function(){
			$scope.getNext();
			$scope.menu = false;
		}, function(err){
			console.log(err);
		})
	}
})
