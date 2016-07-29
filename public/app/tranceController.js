'use strict;'
define(["app"] , function (app) {
	//configuration	
	app.service('httpInterceptor', ['$rootScope' ,'$q' , '$window', function($rootScope ,$q , $window) {
          var service = this;
          service.request = function(config) { 
              var access_token = $window.sessionStorage.token ? $window.sessionStorage.token : null;
              
              if (access_token) {
                  config.headers.Authorization = "Token" + " " + access_token;
              }
              return config;
          };

          service.requestError = function (rejection) {
                      console.info(rejection);
                      return $q.reject(rejection);
                  };

          service.response = function (response) {
                      console.log("~~interceptor response success~~");
              //        growl.addInfoMessage("Success !!!" ,  {ttl: 3000});
              //        console.log(response);
              //        console.log(response.status);
              //        console.log(response.config.url);
                      return response;
                  };

          service.responseError = function (rejection) {
                      console.log("~~interceptor response error~~");
                  //    growl.addInfoMessage("Error occured !!!" ,  {ttl: 3000});
                  //    console.log(rejection);
                  //    console.log(rejection.status);
                      return $q.reject(rejection);
                  };
          return service;
      }]);

    app.config(['$provide','$stateProvider', '$resourceProvider', '$controllerProvider' , '$compileProvider', '$filterProvider', '$animateProvider', '$urlRouterProvider', '$uiViewScrollProvider' , '$httpProvider',
        function ($provide, $stateProvider, $resourceProvider, $controllerProvider, $compileProvider, $filterProvider , $animateProvider,$urlRouterProvider, $uiViewScrollProvider , $httpProvider) {
        $uiViewScrollProvider.useAnchorScroll();
        $httpProvider.interceptors.push('httpInterceptor');
        app.registerController = $controllerProvider.register;
        app.registerFilter = $filterProvider.register;
        app.registerAnimate = $animateProvider.register;
        app.registerDirective = $compileProvider.directive;
        app.registerService = $provide.service;
        app.registerFactory = $provide.factory;
        app.registerValue = $provide.value;
        app.registerConstant = $provide.constant;
        //$cookieProvider defaults
        //var cookieExpireDate = new Date();
        // $cookiesProvider.defaults.path = '/';
        // $cookiesProvider.defaults.domain = location.hostname;
        // $cookiesProvider.defaults.secure = true;
        //$cookiesProvider.defaults.expires = new Date(cookieExpireDate.getFullYear(), cookieExpireDate.getMonth(), cookieExpireDate.getDate() + 30);
        // blockUI Config 
        // blockUIConfig.autoBlock = true;
        // blockUIConfig.preventRouting = false;
        // blockUIConfig.blockBrowserNavigation = true;
        // blockUIConfig.requestFilter = function(config) {
        // //  console.log(config);
        //   var message = "Please wait ";
        //   switch(config.method) {
        //     case 'GET':
        //       message += 'loading...';
        //       break;

        //     case 'POST':
        //       message += '...'; //sending
        //       break;

        //     case 'DELETE':
        //       message += 'deleting...';
        //       break;

        //     case 'PUT':
        //       message += 'updating...';
        //       break;
        //   };
        //   return message;
        // };
      $resourceProvider.defaults.stripTrailingSlashes = false;
      $stateProvider
        .state('home', {
          url: '',
          views: {
            'base-view': {
              templateUrl: 'components/templates/home.tpl.html'
            }
          }
        })
        .state('home.login' , {
          url:'/login',
          views: {
            'home-view': {
              templateUrl: 'app/user/login-user.html',
              controller : 'loginController as login',
              resolve : {
                load : ['$q' , function ($q) {
                  var defered = $q.defer();
                  console.log("loading login.controller");
                  require(['user_Controller', 'account_Login_Services'] , function () {
                    console.log("user_Controller...")
                    return defered.resolve();
                  });
                  return defered.promise;
                }]
              }
            }
          }
        })
        .state('home.account' , {
          url: "/account" ,
          views : {
            'home-view' : {
              templateUrl : 'app/user/create-account.html',
              controller : 'accountController as account',
              resolve : {
                load : ['$q' , function ($q) {
                  var defered = $q.defer();
                  console.log("loading user_Controller");
                  require(['user_Controller' , 'account_Login_Services'] , function () {
                    return defered.resolve();
                  });
                  return defered.promise;
                }]
              }
            }
          }
        })
        .state('home.view', {
          url: '/user',
          views: {
            'home-view' : {
              templateUrl : 'components/templates/base.tpl.html'
            }
          }
        })
        .state('home.view.content', {
          url:"/home",
          views : {
            'top-nav': {
              templateUrl: 'components/templates/top-nav.tpl.html',
              controller : 'topController as common',
              resolve : {
                load : ['$q' , function ($q) {
                  var defered = $q.defer();
                  console.log("loading common_Controller"); // fixes made here
                  require(['common_Controller', 'user_Controller' , 'dashboard_Services'] , function () {
                    return defered.resolve();
                  });
                  return defered.promise;
                }]
              }
            },
            'side-nav': {
              templateUrl: 'components/templates/side-nav.tpl.html',
              controller : 'sideController as sideCtrl'
            },
            'content-view': {
              templateUrl: 'components/templates/content.tpl.html'
            },
          }
        })
        .state('home.view.content.dashboard' , {
          url : "/dashboard",
          views : {
            'inner-view': {
              templateUrl: 'app/dashboard/dashboard.html',
              controller : 'dashboardController as dashboard',
              resolve : {
                load : ['$q' , function ($q) {
                  var defered = $q.defer();
                  console.log("loading dashboard_Controller"); // fixes made here
                  require(['dashboard_Services', 'dashboard_Controller'] , function () {
                    return defered.resolve();
                  });
                  return defered.promise;
                }]
              }
            }
          }
        })
	}]);
	//run instance 
	app.run([ '$rootScope', '$state', '$window','$location' , 'loginService', 'accountService','fbServices',
    function($rootScope, $state, $window, $location, loginService, accountService, fbServices) {
		console.log("app running");

    $rootScope._loggedUser = loginService.getCurrentUser();
    $rootScope._activeUserList = [];
    $rootScope._toggleClass = 1;
    $rootScope._userType = "clients";

		$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			console.log(toState , fromState , !loginService.getToken());
	    	// your logic here...
        if(toState.name !== "home.login" && toState.name !== "home.account") {
          if(!loginService.getToken()) {
            event.preventDefault();
            $state.go("home.login");
          }
        }
	  }); 
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        console.log(fromState);
        console.log('$stateChangeSuccess');
        console.log($location.absUrl());
        console.log(toState);
        if(toState.name !== "home.login" && toState.name !== "home.account") {
          $state.go("home.view.content.dashboard");
        }
    });


     $window.fbAsyncInit = function () {
        FB.init({
            appId:'1126006950792017',
            status:true,
            cookie:true,
            xfbml:true,
            version:'v2.7'
        });
        
        FB.Event.subscribe('auth.statusChange', function(response) {
            console.log("auth.statusChange" , response);
            $rootScope.$broadcast("fbInitStatusChange", response);
        });
    };

    $rootScope.$on("fbInitStatusChange" , function (event , data) {
      console.log(data);
      if(data.status === "connected") {
        fbServices.tagged_places(data.authResponse.userID , {limit : 100} ).then(function (response) {
          console.log(response);
        }, function (error) {
          console.log(error);
        })
      }else{
        fbServices.login();
      }
      
      //$state.go("home.login");
    });

    $rootScope.$on('fb_connected', function (event, data) {
      console.log("fb_connected", data, fbServices.fbAuth);
      loginService.setToken(data.fb_id);
      
      fbServices.myProfile(data.fb_id , "email,first_name,last_name,birthday,gender").then(function (response) {
        console.log(response);
        var userData = {};
        userData.email = response.email;
        userData.first_name = response.first_name;
        userData.last_name = response.last_name;
        userData.dob = response.birthday;
        userData.gender = response.gender;
        userData.social_id = [{'id' : response.id , 'social' : "facebook"}];
        userData.password = response.id;
        userData.role = "client";
        accountService.create_user.createUser(userData , function (response) {
          console.log(response);
        }, function (error){
          console.log(error);
        })
      }, function (error) {
        console.log(error);
      })

      $state.go("home.view.content.dashboard");
    });
    $rootScope.$on('fb_getstatus', function (event , data) {
      console.log("fb_connected", data);
    });
    $rootScope.$on('fb_login_failed', function (event , data) {
      console.log("fb_login_failed", data);
    });

    (function (d) {
        var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement('script');
        js.id = id;
        js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";
        ref.parentNode.insertBefore(js, ref);
    }(document));

	}]);

	app.controller('tranceAppController', ['$rootScope','$scope', '$state','$window', '$http', function($rootScope , $scope, $state, $window, $http){
		console.log("tranceAppController");
    $state.go("home");
    //$state.go("home.view.content.dashboard");
	}]);
})