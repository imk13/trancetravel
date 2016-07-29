'use strict';

define(['app'] , function (app) {
	//var app = angular.module("tranceTravel");
	app.registerFactory('googleMapService' , ['$rootScope' , '$window' , '$q' , 
		function ($rootScope , $window , $q) {
		var googleMapService = this;
		googleMapService.gmap = {};
		googleMapService.gmapInfoWindow = {};
		googleMapService.gmapInputSearch = {}
		googleMapService = {
			mapInit : function (element , mapOptions) {
				googleMapService.gmap = new google.maps.Map(element, mapOptions);
			},

			getMap : function () {
				return googleMapService.gmap;
			},

			newMap : function (element , mapOptions) {
				return (new google.maps.Map(element , mapOptions));
			},

			mapPosition : function (lat , lng) {
				return (new google.maps.LatLng(lat,lng));
			},

			mapMarkerInit : function (markerOptions) {
				googleMapService.gmapMarker = (new google.maps.Marker(markerOptions));
			},

			getMapMarkerInit : function () {
				return googleMapService.gmapMarker;
			},

			mapInfoWindow : function () {
				googleMapService.gmapInfoWindow = (new google.maps.InfoWindow());
			},

			getMapInfoWindow : function () {
				return googleMapService.gmapInfoWindow;
			},

			mapInputSearchBox : function (inputEle) {
				googleMapService.gmapInputSearch = new google.maps.places.SearchBox(inputEle);
			},

			getMapPlacesService : function (gmap) {
				return new google.maps.places.PlacesService(gmap);
			}

		}
		return googleMapService;
	}]);

	app.registerDirective("ngMap" , ['googleMapService' , '$parse' , 
		function directiveMapInit(googleMapService , $parse) {
		return {
			restrict : 'E',
			priority : 1000,
			scope : {
				mapOptions : '=',
				center : '@',
				gmapLoaded : '&'
			},
			transclude : true,
			template : "<div id='gmap' style='height:500px'><div ng-transclude></div</div>",
			//template : angular.element("marker")[0].outerHTML + "<div id='gmap' style='height:500px'></div>",
			controller : ("ngMapController" , ['$scope' , '$rootScope' , '$window', 'googleMapService',
				function ngMapController ($scope , $rootScope , $window, googleMapService){
				$scope.dashboard = {};
				var RADIUS_CONST = 	350000;
				var zoomLevel = 4;
				$scope.dashboard.zoomLevel = zoomLevel;
				$scope.dashboard.indiaMetroMarker = [
					{'city' : 'Delhi' , 'lat' : "28.6139" , "lng" : "77.2090", gps : [28.6139,77.2090]},
					{'city' : 'Mumbai', 'lat' : '19.0760', 'lng' : '72.8777', gps :  [19.0760,72.8777]},
					{'city' : 'Chennai', 'lat' : '13.0827', 'lng' : '80.2707', gps : [13.0827,80.2707]},
					{'city' : 'Kolkata', 'lat' : '22.5726', 'lng' : '88.3639', gps : [22.5726,88.3639]}];
				
				$scope.radius = RADIUS_CONST / zoomLevel;
				$scope.metroCity = angular.copy($scope.dashboard.indiaMetroMarker[0]);
				$scope.metroCity.idx = 0;
				setTimeout(function () {
					$scope.metroCity.idx = 1;
				}, 5000);

				$scope.childClick = function () {
					alert("child directive click");
				}
			}]),
			link : function mapInit(scope , ele , attrs, ngMapCtrl , transclude) {
					var mapOptions = scope.mapOptions;
					console.log(mapOptions , ngMapCtrl);
					transclude(scope, function(clone) {
						ele.append(clone);
					});
					if(typeof googleMapService.gmap === 'undefined') {
						googleMapService.mapInit(angular.element("#gmap")[0] , mapOptions);
						google.maps.event.addListenerOnce(googleMapService.gmap, 'idle', function(){
							scope.gmapLoaded({'map' : googleMapService.gmap});
						});

						googleMapService.getMap().addListener('zoom_changed', function() {
		    				scope.dashboard.zoomLevel = googleMapService.getMap().getZoom();
		    				scope.metroCity.idx = scope.metroCity.idx ? 0 : 1;
		    				console.log("zoomLevel : " , scope.dashboard.zoomLevel, scope.metroCity.idx);
		    				scope.radius = 350000 / (scope.dashboard.zoomLevel * scope.dashboard.zoomLevel);
		  				});
					}
				}
		};
	}]);

	app.registerDirective("marker" , ['googleMapService' , '$parse', '$compile', '$timeout', 
		function directiveMarkerInit(googleMapService , $parse, $compile, $timeout) {
		return {
			restrict : 'E',
			priority : 100,
			require : "^?ngMap",
			scope : {
				markerOptions : '=',
				position : '@',
				onClick : '&'
			},
			controller : ("ngMapController" , ['$scope' , '$rootScope' , '$window', 'googleMapService', 
				function ngMarkerController ($scope , $rootScope , $window, googleMapService){
				console.log($scope);
			}]),
			link : function markerInit(scope , ele , attrs, ngMapCtrl) {
					//var markerOptions = scope.markerOptions;
					//$timeout(function () {});
					console.log(ele, ngMapCtrl , scope.onClick);
					//ngMapCtrl.childClick();
					//$compile(ele)(scope);
					scope.ngMapCtrl = ngMapCtrl;
					scope.$watch('markerOptions' , function (markerOptions) {
						console.log(markerOptions);
						var marker = new google.maps.Marker({
							map: googleMapService.getMap(),
							position: googleMapService.mapPosition(markerOptions.gps[0] , markerOptions.gps[1]),
							title : markerOptions.city
							// icon: {
							// 	url: 'http://maps.gstatic.com/mapfiles/circle.png',
							// 	anchor: new google.maps.Point(10, 10),
							// 	scaledSize: new google.maps.Size(10, 17)
							// }
						});

						marker.setMap(googleMapService.getMap());

						google.maps.event.addListener(marker, 'click', function () {
							console.log(marker.getPosition().lat() , marker.getPosition().lng());
						    googleMapService.getMap().panTo(marker.getPosition());
						    scope.onClick({'$event' : 'click'});
						    //map.setCenter(marker.getPosition()); // sets center without animation
						});
					})
				}
		};
	}]);

	app.registerDirective("shape",['$parse' , 'googleMapService',
		function directiveFunction($parse, googleMapService){
		return {
			require : ["^?ngMap",'^?marker'],
			scope: {
				type : '@',
	            radius: '=',
	            position : '=',
	            draggable : '=',
	        },
	        link : function shapeInit(scope , ele , attrs, ngMapCtrls) {
	        	var draggable = scope.draggable > 1 ? true : false;
	        	console.log(draggable , scope.position , googleMapService.getMap());
	        	var cityCircle = new google.maps.Circle({
					strokeColor: '#FF0000',
					strokeOpacity: 0.8,
					strokeWeight: 2,
					fillColor: '#FF0000',
					fillOpacity: 0.35,
					editable : false,
					draggable : true,
					map: googleMapService.getMap(),
					center: googleMapService.mapPosition(scope.position[0], scope.position[1]),
					radius: Math.sqrt(scope.radius) * 100
				});
	        	scope.$watch("[draggable , radius]" ,  function (values) {
	        		draggable = values[0] > 1 ? true : false;
	        		console.log(values);
	        		cityCircle.setMap(null);
	        		cityCircle = new google.maps.Circle({
						strokeColor: '#FF0000',
						strokeOpacity: 0.8,
						strokeWeight: 2,
						fillColor: '#FF0000',
						fillOpacity: 0.35,
						editable : false,
						draggable : true,
						map: googleMapService.getMap(),
						center: googleMapService.mapPosition(scope.position[0] , scope.position[1]),
						radius: Math.sqrt(values[1]) * 100
					});
	        	}, true);

	        	google.maps.event.addListener(cityCircle, 'dragstart', function() {
					console.log("dragstart");
				});
				google.maps.event.addListener(cityCircle, 'drag', function() {
					console.log("dragging");
				});
				google.maps.event.addListener(cityCircle, 'dragend', function() {
					console.log("dragend");
				});

	    //     	scope.$watch("radius" ,  function (radius) {
	    //     		console.log(draggable);
	    //     		cityCircle.setMap(null);
	    //     		cityCircle = new google.maps.Circle({
					// 	strokeColor: '#FF0000',
					// 	strokeOpacity: 0.8,
					// 	strokeWeight: 2,
					// 	fillColor: '#FF0000',
					// 	fillOpacity: 0.35,
					// 	draggable : draggable,
					// 	map: googleMapService.getMap(),
					// 	center: googleMapService.mapPosition(scope.position[0] , scope.position[1]),
					// 	radius: Math.sqrt(scope.radius) * 100
					// });
	    //     	})
	        }
		}
	}])

	app.registerDirective('customRadius', ['$parse' , 
		function directiveFunction($parse){
	    return {
	        scope: {
	            customRadius: '=', //use =? for optionality
	        },
	        link: function(scope, element, attr){

	            //modelObject needs to be defined on the parent scope or you can use "=?" for optionality
	            console.log(scope.customRadius , attr); //this will be the parent/current scope's value, it's not the literal string
	            //this will result in digest errors: http://stackoverflow.com/q/13594732/582917
	            //so don't use object expressions with '='

	            //IMPORTANT: if scope.modelObject was not defined on the parent scope, then '=' interpolates it into an UNDEFINED type, this works for child objects as well like scope.modelObject.childObject
	            //if the DOM attribute was not defined, scope.property would returned undefined

	            //the $watch method works when the model values have not yet been processed by the time this directive runs
	            scope.$watch('customRadius', function(value){
	                if(value){
	                    console.log(value , attr , attr.radius);
	                    attr.radius = value;
	                    //scope.$apply()
	                }
	            });

	            //$observe is useless here, as there is no interpolation whatsoever, the $watch will react to changes from both parent scope and current scope, furthermore any change to the value here, changes the parent value as well

	            //=? is required if you want to assign values to the current isolated scope property, but the DOM attribute or parent scope property was never defined, checking if it exists or logging its current value won't result in an error
        	}
    	};
	}]);

	app.registerController("dashboardController" , ['$rootScope' , '$scope' , '$state' , '$window','googleMapService', 
		function dashboardController ( $rootScope , $scope , $state , $window, googleMapService) {
		console.log("dashboardController");
		var dashboard = this;
		//dashboard.indiaMetroMarker = [];
		
		dashboard.getLoadedMap = function (gmap) {
			console.log(gmap);
			dashboard.indiaMetroMarker = [
			{'city' : 'Delhi' , 'lat' : "28.6139" , "lng" : "77.2090", gps : [28.6139,77.2090]},
			{'city' : 'Mumbai', 'lat' : '19.0760', 'lng' : '72.8777', gps :  [19.0760,72.8777]},
			{'city' : 'Chennai', 'lat' : '13.0827', 'lng' : '80.2707', gps : [13.0827,80.2707]},
			{'city' : 'Kolkata', 'lat' : '22.5726', 'lng' : '88.3639', gps : [22.5726,88.3639]}];
			dashboard.metroCity = {};
			dashboard.metroCity = angular.copy(dashboard.indiaMetroMarker[0]);
			dashboard.metroCity.idx = 0;
			console.log(googleMapService.mapPosition(13.0827, 80.2707))

			// var marker = new google.maps.Marker({
			// 	map: gmap,
			// 	position: googleMapService.mapPosition(13.0827,80.2707),
			// 	title : "13.0827,80.2707"
			// });
			// googleMapService.mapInfoWindow();
			// var infowindow = googleMapService.getMapInfoWindow();
			// console.log(infowindow);
			// google.maps.event.addListener(marker, 'click', function() {
			// 	infowindow.setContent('<div' + ' title="' + dashboard.metroCity.city + '"'+ '><strong>' + dashboard.metroCity.city + '</strong><br>' +
			// 	'Place ID: ' + dashboard.metroCity.idx + '<br>' +
			// 	dashboard.metroCity.cityAddress + '</div>');
			// 	infowindow.open(googleMapService.getMap(), this);
			// });

			// marker.setMap(googleMapService.getMap());
			//$scope.$digest();
			//$scope.$apply();
		};

		var RADIUS_CONST = 	350000;
		var placesService = {};

		dashboard.radius = RADIUS_CONST / dashboard.zoomLevel;
		dashboard.searchMarker = [];
		dashboard.clatlng = [28.6139,77.2090];
		dashboard.maptype = "ROADMAP";
		dashboard.zoomLevel = 4;

		dashboard.mapOptions = {
            center: new google.maps.LatLng(dashboard.clatlng[0] , dashboard.clatlng[1]),
            zoom: dashboard.zoomLevel,
            mapTypeId: google.maps.MapTypeId[dashboard.maptype],
            scrollwheel: false
        };

		dashboard.getMap = googleMapService.getMap;

        dashboard.searchPlaces = function (event, gmapSearch) {
        	console.log(gmapSearch);
        };

        $scope.setMapCenter =  function (event) {
        	console.log(dashboard.getMap());
        };

        dashboard.showInfoWindow =  function (event, metroValue, metroIdx) {
        	console.log(metroValue);
        };

		// function gmapPlacesService (gmap) {
		// 	return new google.maps.places.PlacesService(gmap);
		// }

		// NgMap.getMap().then(function(gmap) {
		// 	dashboard.map = gmap;
		// 	//map.markers = self.indiaMetroMarker;
		// 	console.log(gmap.getCenter());
		// 	console.log('markers', gmap.markers);
		// 	console.log('shapes', gmap.shapes);
		// 	placesService = gmapPlacesService(gmap);
		// 	gmap.addListener('idle', performSearch);
		// 	// Create the search box and link it to the UI element.
		// var input = document.getElementById('pac-input');
		// var searchBox = new google.maps.places.SearchBox(input);
		// dashboard.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

		// // Bias the SearchBox results towards current map's viewport.
		// dashboard.map.addListener('bounds_changed', function() {
		// 	searchBox.setBounds(dashboard.map.getBounds());
		// });

		// var markers = [];
		// // Listen for the event fired when the user selects a prediction and retrieve
		// // more details for that place.
		// searchBox.addListener('places_changed', function() {
		// 	var places = searchBox.getPlaces();

		// 	if (places.length == 0) {
		// 		return;
		// 	}	

		// 	// Clear out the old markers.
		// 	markers.forEach(function(marker) {
		// 		marker.setMap(null);
		// 	});
		// 	markers = [];

		// 	// For each place, get the icon, name and location.
		// 	var bounds = new google.maps.LatLngBounds();
		// 	places.forEach(function(place) {
		// 		var icon = {
		// 			url: place.icon,
		// 			size: new google.maps.Size(71, 71),
		// 			origin: new google.maps.Point(0, 0),
		// 			anchor: new google.maps.Point(17, 34),
		// 			scaledSize: new google.maps.Size(25, 25)
		// 		};

		// 	// Create a marker for each place.
		// 		markers.push(new google.maps.Marker({
		// 			map: dashboard.map,
		// 			icon: icon,
		// 			title: place.name,
		// 			position: place.geometry.location
		// 		}));

		// 		if (place.geometry.viewport) {
		// 		// Only geocodes have viewport.
		// 			bounds.union(place.geometry.viewport);
		// 		} else {
		// 			bounds.extend(place.geometry.location);
		// 		}
		// 	});
		// 	dashboard.map.fitBounds(bounds);
		// });
		// });

		// dashboard.searchPlaces = function (event , gmapSearch) {
		// 	console.log(event , gmapSearch);
		// };

		// function performSearch() {
		// 	var request = {
		// 		bounds: dashboard.map.getBounds(),
		// 		keyword: 'hospital police'
		// 	};
		// 	placesService.radarSearch(request, callback);
		// }

		// function callback(results, status) {
		// 	console.log(status , results);
		// 	alert(status);
		// 	if (status !== google.maps.places.PlacesServiceStatus.OK) {
		// 		console.error(status);
		// 		return;
		// 	}
		// 	for (var i = 0, result; result = results[i]; i++) {
		// 		addMarker(result);
		// 	}
		// }

		// function placeDetails (place) {
		// 	var infowindow = new google.maps.InfoWindow();
		// 	placesService.getDetails({
		// 			placeId: place.place_id
		// 		}, function(place, status) {
		// 			if (status === google.maps.places.PlacesServiceStatus.OK) {
		// 				var marker = new google.maps.Marker({
		// 					map: dashboard.map,
		// 					position: place.geometry.location,
		// 					title : place.name,
		// 					icon: {
		// 						url: 'http://maps.gstatic.com/mapfiles/circle.png',
		// 						anchor: new google.maps.Point(10, 10),
		// 						scaledSize: new google.maps.Size(10, 17)
		// 					}
		// 				});
		// 				google.maps.event.addListener(marker, 'click', function() {
		// 					infowindow.setContent('<div' + ' title="' + place.name + '"'+ '><strong>' + place.name + '</strong><br>' +
		// 					'Place ID: ' + place.place_id + '<br>' +
		// 					place.formatted_address + '</div>');
		// 					infowindow.open(dashboard.map, this);
		// 				});
		// 			}
		// 		});
		// }

		// function addMarker(place) {
		// 	placeDetails(place)
		// 	// var marker = new google.maps.Marker({
		// 	// 	map: dashboard.map,
		// 	// 	position: place.geometry.location,
		// 	// 	icon: {
		// 	// 		url: 'http://maps.gstatic.com/mapfiles/circle.png',
		// 	// 		anchor: new google.maps.Point(10, 10),
		// 	// 		scaledSize: new google.maps.Size(10, 17)
		// 	// 	}
		// 	// });
		// }


		// dashboard.showInfoWindow = function (event, metroCity, metroIdx) {
		// 	console.log(metroCity);
		// 	dashboard.metroCity = angular.copy(metroCity);
		// 	dashboard.metroCity.idx = metroIdx;
		// 	dashboard.map.showInfoWindow('metro-miw', "metro-" + metroCity.city+ "-" + (metroIdx + 1));
		// };

		// dashboard.insideInfoWindow = function () {
		// 	console.log("clicked inside info window");
		// };

		// dashboard.getMapRadius = function () {
		// 	return (dashboard.radius);
		// };

		// dashboard.getZoom = function () {
		// 	return dashboard.zoomLevel;
		// };

		// dashboard.zoomChanged= function(event) {
		// 	console.log(dashboard.map.getBounds() , dashboard.map.shapes.metrocircle, dashboard.map.getZoom());
		// 	dashboard.zoomLevel = dashboard.map.getZoom();
		// 	dashboard.radius = (RADIUS_CONST) / (dashboard.zoomLevel);
		// 	dashboard.map.shapes.metrocircle.radius = dashboard.radius;
		//     //dashboard.map.shapes.metrocircle.setBounds(dashboard.map.getBounds());
		// };

		// dashboard.cMapDragStart = function (event) {
		// 	console.log("cMapDragStart",  event);
		// };

		// dashboard.cMapDragging = function (event) {
		// 	console.log("cMapDragging", event);
		// };

		// dashboard.cMapDragEnd = function (event) {
		// 	console.log("cMapDragEnd", event);
		// };

		// dashboard.placeMarker = function(event) {
		// 	console.log(event);
		// 	var marker = new google.maps.Marker({position: event.latLng, map: dashboard.map});
		// 	console.log(marker);
		// 	dashboard.map.panTo(event.latLng);
		// };

		// dashboard.setMapCenter = function(event) {
		// 	console.log(event);
		// 	//dashboard.placeMarker(event);
  //   		//dashboard.map.setZoom(5);
  //   		dashboard.map.setCenter(event.latLng);
  //   	};



	}]);
})