'use strict';

define(['app'] , function (app) {
	console.log(app);
	//var app = angular.module("tranceTravel");
	app.registerController("topController" , ['$rootScope' , '$scope' , '$state' , '$window', 'loginService',
		function ( $rootScope , $scope , $state , $window, loginService) {
		console.log("topController");
		$rootScope._loggedUser = loginService.getCurrentUser();
		
		$scope.logout = function () {
			loginService.logout();
			$state.go("home.login");
		};

	}]);
	
	app.registerController("sideController" , ['$rootScope' , '$scope' , '$state' , '$window', 'loginService', 'googleMapService', 'locationService',
		function ( $rootScope , $scope , $state , $window, loginService, googleMapService, locationService) {
		console.log("sideController");
		$rootScope._activeUserList = [];
		$rootScope._toggleClass = 1;
		$rootScope._userType = "clients";

		$scope.getActiveUsers = function () {
			loginService.user_list.userList({"role" : $rootScope._userType}, function (response) {
				console.log(response);
				$rootScope._activeUserList = angular.copy(response.reverse());
			}, function (error) {
				console.log(error);
			})
		};

		function setUserMarker (userInfo) {
			console.log(userInfo);
			var marker = new google.maps.Marker({
				map: googleMapService.getMap(),
				position: googleMapService.mapPosition(parseFloat(userInfo.location.lat) ,parseFloat(userInfo.location.lng)),
				title : userInfo.first_name + " " + userInfo.last_name,
				label : userInfo.first_name[0]
			});
			var infowindow = googleMapService.getMapInfoWindow();
			//console.log(infowindow);
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.setContent('<div' + ' title="' + userInfo.first_name + " " + userInfo.last_name 
					+ '"'+ '><strong>' + userInfo.first_name + " " + userInfo.last_name + '</strong><br>' +
				'User ID: ' + userInfo._id + '<br>' +
				userInfo.email + '</div>');
				infowindow.open(googleMapService.getMap(), this);
				//dashboard.setMapCenter('click' , marker.getPosition())
			});
		}

		$scope.updateTopSideBar = function (index , value) {
			console.log(index,  value);
			var userInfo = $rootScope._activeUserList[index];
			$rootScope._toggleClass = index;
			locationService.user_location_list.userLocationList({"uid" : userInfo._id}, function (response) {
				console.log(response);
				var locationList = angular.copy(response);
				userInfo.location = {};
				angular.forEach(locationList , function (locVal , locIdx) {

					userInfo.location = locVal.location;
					setUserMarker(userInfo);
				})
			}, function (error) {
				console.log(error);
			})
			//setUserMarker($rootScope._activeUserList[index]);
		};

	}])
})