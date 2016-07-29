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

	app.registerController("dashboardController" , ['$rootScope' , '$scope' , '$state' , '$window','googleMapService', 'locationService', 'loginService',
		function dashboardController ( $rootScope , $scope , $state , $window, googleMapService, locationService, loginService) {
		console.log("dashboardController");
		var dashboard = this;
		//dashboard.indiaMetroMarker = [];
		var placeLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var placeLabelIdx = 0;
		var RADIUS_CONST = 	350000;
		var placesService = {};
		var searchPlacesMarker = [];
		var searchQueryTimeout = 0;
		dashboard.zoomLevel = 4;
		dashboard.radius = RADIUS_CONST / dashboard.zoomLevel;
		dashboard.searchMarker = [];
		dashboard.clatlng = [28.6139,77.2090];
		dashboard.maptype = "ROADMAP";
		dashboard.runningCoords = {"lat"  : 0 , "lng" : 0}
		
		dashboard.mapOptions = {
            center: new google.maps.LatLng(dashboard.clatlng[0] , dashboard.clatlng[1]),
            zoom: dashboard.zoomLevel,
            mapTypeId: google.maps.MapTypeId[dashboard.maptype],
            scrollwheel: true
        };

		googleMapService.mapInit(angular.element("#gmap")[0] , dashboard.mapOptions);

		google.maps.event.addListenerOnce(googleMapService.gmap, 'idle', function(){
			dashboard.getLoadedMap(googleMapService.gmap);
		});

		dashboard.getLoadedMap = function (gmap) {
			console.log(gmap);
			var coordsDiv = document.getElementById('running-coords');
	        
	        gmap.controls[google.maps.ControlPosition.TOP_RIGHT].push(coordsDiv);
	        
	        gmap.addListener('mousemove', function(event) {
	        	dashboard.runningCoords.lat = (event.latLng.lat().toFixed(2));
	        	dashboard.runningCoords.lng = (event.latLng.lng().toFixed(2))
	          	coordsDiv.textContent =
	              	'lat: ' + Math.round(event.latLng.lat()) + ', ' +
	              	'lng: ' + Math.round(event.latLng.lng());
	        });

			dashboard.map = gmap;
			dashboard.indiaMetroMarker = [
			{'city' : 'Delhi' , 'lat' : "28.6139" , "lng" : "77.2090", "gps" : [28.6139,77.2090]},
			{'city' : 'Mumbai', 'lat' : '19.0760', 'lng' : '72.8777', "gps" :  [19.0760,72.8777]},
			{'city' : 'Chennai', 'lat' : '13.0827', 'lng' : '80.2707', "gps" : [13.0827,80.2707]},
			{'city' : 'Kolkata', 'lat' : '22.5726', 'lng' : '88.3639', "gps" : [22.5726,88.3639]}];
			dashboard.metroCity = {};
			dashboard.metroCity = angular.copy(dashboard.indiaMetroMarker[0]);
			dashboard.metroCity.idx = 0;
//			console.log(googleMapService.mapPosition(13.0827, 80.2707));
			googleMapService.mapInfoWindow();
			var infoWindow = googleMapService.getMapInfoWindow();

			angular.forEach(dashboard.indiaMetroMarker ,  function (metroMarker , metroIdx) {
				var marker = new google.maps.Marker({
					map: gmap,
					position: googleMapService.mapPosition(metroMarker.gps[0],metroMarker.gps[1]),
					title : metroMarker.city,
					label : metroMarker.city[0]
				});
				//console.log(infoWindow);
				google.maps.event.addListener(marker, 'click', function() {
					infoWindow.setContent('<div' + ' title="' + metroMarker.city 
						+ '"'+ '><strong>' + metroMarker.city + '</strong><br>' +
					'Place ID: ' + metroIdx + '<br>' +
					metroMarker.city + '</div>');
					infoWindow.open(googleMapService.getMap(), this);
					dashboard.setMapCenter('click' , marker.getPosition())
				});
			})
			//map.markers = self.indiaMetroMarker;
//			console.log(gmap.getCenter());
			placesService = googleMapService.getMapPlacesService(gmap);
			
			gmap.addListener('idle', performSearch);
				// Create the search box and link it to the UI element.
			var input = document.getElementById('pac-input');
			input.style.visibility = "visibile";
			var searchBox = new google.maps.places.SearchBox(input);

			gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

			// Bias the SearchBox results towards current map's viewport.
			gmap.addListener('bounds_changed', function() {
				searchBox.setBounds(gmap.getBounds());
			});

			var markers = [];
			// Listen for the event fired when the user selects a prediction and retrieve
			// more details for that place.
			searchBox.addListener('places_changed', function() {
				var places = searchBox.getPlaces();

				if (places.length == 0) {
					return;
				}	

				// Clear out the old markers.
				markers.forEach(function(marker) {
					marker.setMap(null);
				});
				markers = [];

				// For each place, get the icon, name and location.
				var bounds = new google.maps.LatLngBounds();
				places.forEach(function(place) {
					var icon = {
						url: place.icon,
						size: new google.maps.Size(71, 71),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(17, 34),
						scaledSize: new google.maps.Size(25, 25)
					};

				// Create a marker for each place.
					markers.push(new google.maps.Marker({
						map: gmap,
						icon: icon,
						title: place.name,
						position: place.geometry.location
					}));

					if (place.geometry.viewport) {
					// Only geocodes have viewport.
						bounds.union(place.geometry.viewport);
					} else {
						bounds.extend(place.geometry.location);
					}
				});
				console.log(bounds);
				gmap.fitBounds(bounds);
			});

			  // Try HTML5 geolocation.
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					var cposInfoWindow = googleMapService.getMapInfoWindow();
					//console.log(position , gmap);
					var pos = {
						lat: position.coords.latitude,
						lng: position.coords.longitude
					};
				//	console.log(googleMapService.mapPosition(pos.lat , pos.lng));
					// Create a marker for each place.
					var currentMarker = (new google.maps.Marker({
						map: gmap,
						icon: "http://www.robotwoods.com/dev/misc/bluecircle.png",
						title: "Current location",
						position: googleMapService.mapPosition(pos.lat , pos.lng),
						attribution: {
							source: 'Google Maps JavaScript API',
							webUrl: 'https://developers.google.com/maps/'
						}
					}));
					
					var cityCircle = new google.maps.Circle({
						strokeColor: '#FF0000',
						strokeOpacity: 0.8,
						strokeWeight: 2,
						fillColor: '#FF0000',
						fillOpacity: 0.35,
						editable : true,
						draggable : false,
						map: googleMapService.getMap(),
						center: googleMapService.mapPosition(pos.lat , pos.lng),
						radius: Math.sqrt(dashboard.radius) * 100
					});

					// cposInfoWindow.setPosition(googleMapService.mapPosition(pos.lat , pos.lng));
					// cposInfoWindow.setContent('Location found.');
					currentMarker.setMap(gmap);

					// sending current location data to server on click;
					google.maps.event.addListener(currentMarker, 'click', function() {
						var locationInfo = {};
						locationInfo.location = pos;
						locationInfo.uid = loginService.getToken();
						
						locationService.user_location_update.userLocationUpdate({"uid" : locationInfo.uid} , locationInfo, function (response) {
							console.log(response);
						}, function (error){
							console.log(error);
						});

						dashboard.setMapCenter('click' , currentMarker.getPosition());
					});
				}, function() {
					handleLocationError(true, infoWindow, gmap.getCenter());
				});
			} 
			else {
				// Browser doesn't support Geolocation
				handleLocationError(false, infoWindow, gmap.getCenter());
			}

			function handleLocationError(browserHasGeolocation, infoWindow, pos) {
				infoWindow.setPosition(pos);
				infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
			}
		};

		dashboard.getMap = googleMapService.getMap;

        dashboard.searchPlaces = function (event, gmapSearch) {
        	console.log(gmapSearch);
        };

        dashboard.setMapCenter =  function (event , position) {
        	console.log(dashboard.getMap());
        	dashboard.getMap().panTo(position);
        };

        dashboard.showInfoWindow =  function (event, metroValue, metroIdx) {
        	console.log(metroValue);
        };

		dashboard.searchPlaces = function (event , gmapSearch) {
			console.log(event , gmapSearch);
			if(gmapSearch.length) {

			}else{
				
			}
		};

		function performSearch() {
			// console.log("clearing place markers");
			// angular.forEach(searchPlacesMarker , function (marker , markerIdx) {
			// 	marker.setMap(null);
			// })
			var request = {
				bounds: dashboard.map.getBounds(),
				keyword: 'hospital police ngo'
			};
			setTimeout(function () {
				placesService.radarSearch(request, function (results , status) {
					searchQueryTimeout = callback(results, status);
				});
			}, searchQueryTimeout)
		}

		function callback(results, status) {
			console.log(status , results);
			//alert(status);
			if (status !== google.maps.places.PlacesServiceStatus.OK) {
				console.info(status);
				return 2500;
			}
			for (var i = 0, result; result = results[i]; i++) {
				addMarker(result);
			}
			return 500;
		}

		function placeDetails (place) {
			var infowindow = new google.maps.InfoWindow();
			placesService.getDetails({
					placeId: place.place_id
				}, function(place, status) {
					if (status === google.maps.places.PlacesServiceStatus.OK) {
						var placeMarker = new google.maps.Marker({
							map: dashboard.map,
							position: place.geometry.location,
							title : place.name,
							icon: {
								url: 'http://maps.gstatic.com/mapfiles/circle.png',
								anchor: new google.maps.Point(10, 10),
								scaledSize: new google.maps.Size(10, 17)
							}
						});
						searchPlacesMarker.push(placeMarker);
						google.maps.event.addListener(placeMarker, 'click', function() {
							infowindow.setContent('<div' + ' title="' + place.name + '"'+ '><strong>' + place.name + '</strong><br>' +
							'Place ID: ' + place.place_id + '<br>' +
							place.formatted_address + '</div>');
							infowindow.open(dashboard.map, this);
						});
					}
				});
		}

		function addMarker(place) {
			placeDetails(place)
			// var marker = new google.maps.Marker({
			// 	map: dashboard.map,
			// 	position: place.geometry.location,
			// 	icon: {
			// 		url: 'http://maps.gstatic.com/mapfiles/circle.png',
			// 		anchor: new google.maps.Point(10, 10),
			// 		scaledSize: new google.maps.Size(10, 17)
			// 	}
			// });
		};

		google.maps.event.addListener(googleMapService.getMap(), "zoom_changed" , function (zoomLevel) {
			console.log("zoomLevel" , googleMapService.getMap().getZoom());
			dashboard.zoomLevel = googleMapService.getMap().getZoom();
		});


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