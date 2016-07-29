'use strict';

define(['app'] , function (app) {
	console.log(app);
	//var app = angular.module("tranceTravel");;
	app.factory("loginService" ,[ '$resource', '$http' , '$q', '$window',
		function($resource , $http, $q, $window) {
	   		   	
		var loginService = this;

		loginService = {user_login : $resource("/:role/login" , {role : '@role'} , {
				userLogin : { method : "POST" , params : {}}
			}),
			user_list : $resource("/user/:role" , {role : '@role'} , {
				userList : { method : "GET" , params : {}, isArray : true}
			}),
			user_info : $resource("/user/:id" , {id : '@id'} , {
				userInfo : { method : "GET" , params : {}}
			})
		};

		loginService.userInfo = function (){
			var response = {}; 
			return $http
		      .get('/pos/user/information/' , function (result) {
		        console.log(result);
		        response = result;
		        return response;
		    } , function (response) {
		        console.log(response);
		    });
		    
		};

		loginService.setCurrentUser = function (user) {
			loginService.currentUser = user;
			 $window.sessionStorage.current_user = user;
		};

		loginService.getCurrentUser = function (user) {
			return (loginService.currentUser || $window.sessionStorage.current_user);
		};

		loginService.setToken = function (token) {
			loginService.token = token;
			 $window.sessionStorage.token = token;
		};

		loginService.getToken = function () {
			return (loginService.token ? loginService.token : $window.sessionStorage.token);
		};


		loginService.isAuthenticated = function () {
		    return !!$window.sessionStorage.token;
		};

		loginService.logout = function () {
			var deferred = $q.defer();

			console.log("deleting session");
			Object.keys(sessionStorage)
		//	.filter(function(k) { return /foo/.test(k); })
			.forEach(function(k) {
			    sessionStorage.removeItem(k);
			});
			deferred.resolve(true);
			return deferred.promise;
		};
		
		return loginService;
	}]);

	app.factory("accountService", [ '$resource', '$http' , '$q', '$window',
	 function($resource , $http, $q, $window) {
	   		   	
		var accountService = this;
		
		accountService = {create_user : $resource("/user" , {} , {
				createUser : { method : "POST" , params : {}}
			})
		};
		return accountService;
	}]);

	app.factory ("fbServices" , ['$state', '$q', '$rootScope' , '$window', function ($state, $q, $rootScope , $window) {
    var fbServices = this;
	    fbServices = {
	      fbAuth : {},
	      getLoginStatus :  function () {
	        FB.getLoginStatus(function (response) {
	                  $rootScope.$broadcast("fbStatusChange", {'status':response.status});
	              }, true);
	      },

	      myProfile : function (fbId , filter) {
	      	var defer = $q.defer();
	      	if(fbId) {
		      	FB.api("/" + fbId, {'fields' : filter || ""}, function (response) {
		      		defer.resolve(response);
		      	})
		     }else{
		     	defer.reject({'error' : "fb_id is missing"});
		     }
		     return defer.promise;
	      },

	      fbme : function (filter) {
	      	var fields = filter || "email";
	      	var defer = $q.defer();
	      	FB.api("/me" , {'fields' : fields} , function (response) {
	      		defer.resolve(response);
	      	}, function (error) {
	      		defer.reject(error);
	      	});

	      	return defer.promise;
	      },

	      tagged_places : function (fbId ,  filter) {
	      	var defer = $q.defer();
	      	if(fbId) {
		      	FB.api("/" + fbId + "/tagged_places", filter , function (response) {
		      		defer.resolve(response);
		      	})
		     }else{
		     	defer.reject({'error' : "fb_id is missing"});
		     }
		     return defer.promise;
	      },

	      login : function (cb) {
	      		var defer = $q.defer();
	            FB.getLoginStatus(function (response) {
	              switch (response.status) {
	                case 'connected' : 	fbServices.fbAuth = response.authResponse;
	                					$rootScope.$broadcast('fb_connected', {fb_id:response.authResponse.userID});
	                					defer.resolve(fbServices.fbAuth);
	                         			break;
	                case 'not_authorized':
					case 'unknown': 
									FB.login(function (response) {
									    if (response.authResponse) {
									    	fbServices.fbAuth = response.authResponse;
									        $rootScope.$broadcast('fb_connected', {
									            fb_id:response.authResponse.userID,
									            userNotAuthorized:true
									        });
									        defer.resolve(fbServices.fbAuth);
									    } else {
									        $rootScope.$broadcast('fb_login_failed');
									        defer.reject(fbServices.fbAuth);
									    }
									}, {scope:'public_profile,email,user_tagged_places,user_location,user_birthday'});
									break;
	                    default:    FB.login(function (response) {
	                                      if (response.authResponse) {
	                                        fbServices.fbAuth = response.authResponse;
	                                        $rootScope.$broadcast('fb_connected', {fb_id:response.authResponse.userID});
	                                        $rootScope.$broadcast('fb_getstatus');
	                                        defer.resolve(fbServices.fbAuth);
	                                      } else {
	                                        $rootScope.$broadcast('fb_login_failed');
	                                        defer.reject(fbServices.fbAuth);
	                                      }
	                                  });
	                                  break;
	              }
	            });

	            return defer.promise;
	      	},

		    logout: function () {
		    		var defer = $q.defer();
        			FB.logout(function (response) {
        				defer.resolve(response);
	            	}, function (error){
	            		defer.reject(error);
	            	});
	            	return defer.promise;
    			}
	    }
	    return fbServices;
  	}])
});