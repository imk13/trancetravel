'use strict';

define(['app'] , function (app) {
	console.log(app);
	//var app = angular.module("tranceTravel");;
	app.registerFactory("locationService" ,[ '$resource', '$http' , '$q', '$window',
		function($resource , $http, $q, $window) {
	   		   	
		var locationService = this;

		locationService = {user_location : $resource("/loc" , {id : '@uid'} , {
				userLocation : { method : "POST" , params : {}}
			}),
			user_locations : $resource("/locs" , {id : '@uid'} , {
				userLocations : { method : "POST" , params : {}}
			}),
			user_location_update : $resource("/loc/:id" , {id : '@id'} , {
				userLocationUpdate : { method : "PUT" , params : {}}
			}),
			user_location_list : $resource("/:uid/locs" , {uid : '@uid'} , {
				userLocationList : { method : "GET" , params : {}, isArray : true}
			}),
			user_location_info : $resource("/loc/:id" , { id : '@id'} , {
				userLocationInfo : { method : "GET" , params : {}}
			})
		};

		return locationService;
	}]);
});