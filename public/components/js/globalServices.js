/**
 * Global , services
 * Authentication
 * Cookies
 * Notification
 * Internet Status
 * Don't changes services without understanding the impact :)
 * @author : MK
 **/
'use strict';
define(['app'] ,function (app) {
	console.log(app);
//	var angular = require('angular');
//	var app = angular.module("tranceTravel");

	app.factory('cookieService' , ['$rootScope', '$state' , '$window', 'loginService', function ($rootScope, $state , $window, loginService) {
		var cookieService = this;

	    cookieService.setCookie = function (key, value) {
	    	$cookies.put(key , value);
	    };

	    cookieService.getCookie = function (key) {
	    	return $cookies.get(key);
	    };

	    cookieService.removeCookie = function (key) {
	    	return $cookies.remove(key);
	    };

	    return cookieService;
	}])
	
	.factory('notifyService' , ['$rootScope', '$state' , '$window', function ($rootScope, $state , $window) {
		var notifyService = this;
		notifyService.warnMessage = function(message , timeout, callback) {
	        growl.addWarnMessage(message ,  {ttl: timeout}, callback);
	    };
	    notifyService.infoMessage = function(message , timeout, callback) {
	        growl.addInfoMessage(message ,  {ttl: timeout}, callback);
	    };
	    notifyService.successMessage = function(message , timeout, callback) {
	        growl.addInfoMessage(message ,  {ttl: timeout}, callback);
	    };
	    notifyService.errorMessage = function(message , timeout, callback) {
	        growl.addInfoMessage(message ,  {ttl: timeout}, callback);
	    };
	    
	    return notifyService;
	}])

	.factory('directiveService', ['$state', '$q' , '$rootScope' , '$window' , function ( $state, $q , $rootScope , $window) {
      this.modalDirective = function () { return { 
	        template: '<div class="modal fade">' + 
	            '<div class="modal-dialog">' + 
	              '<div class="modal-content">' + 
	                '<div class="modal-header">' + 
	                  '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
	                  '<h4 class="modal-title">{{ title }}</h4>' + 
	                '</div>' + 
	                '<div class="modal-body" ng-transclude></div>' + 
	              '</div>' + 
	            '</div>' + 
	          '</div>',
	        restrict: 'E',
	        transclude: true,
	        replace:true,
	        scope:true,
	        link: function postLink(scope, element, attrs) {
	          scope.title = attrs.title;
	          scope.$watch(attrs.visible, function(value){
	            if(value == true)
	              $(element).modal('show');
	            else
	              $(element).modal('hide');
	          });

	          $(element).on('shown.bs.modal', function(){
	            scope.$apply(function(){
	              scope.$parent[attrs.visible] = true;
	            });
	          });

	          $(element).on('hidden.bs.modal', function(){
	            scope.$apply(function(){
	              scope.$parent[attrs.visible] = false;
	            });
	          });
	        }
	      };
	  }
	  	return this;
    }])

	.factory('onlineStatusServices', ["$window", "$rootScope", function ($window, $rootScope) {
	    var onlineStatusServices = this;

	    onlineStatusServices.onLine = $window.navigator.onLine;

	    onlineStatusServices.isOnline = function() {
	        return onlineStatusServices.onLine;
	    }

	    $window.addEventListener("online", function () {
	        onlineStatusServices.onLine = true;
	        $rootScope.$digest();
	    }, true);

	    $window.addEventListener("offline", function () {
	        onlineStatusServices.onLine = false;
	        $rootScope.$digest();
	    }, true);

	    return onlineStatusServices;
	}])
    
	.factory ("commonservices" , ['$state', '$q', '$rootScope' , '$window', function ($state, $q, $rootScope , $window) {
		commonservices = this;
		Date.prototype.getUTCTime = function(){ 
		  return new Date(
		    this.getUTCFullYear(),
		    this.getUTCMonth(),
		    this.getUTCDate(),
		    this.getUTCHours(),
		    this.getUTCMinutes(), 
		    this.getUTCSeconds()
		  ).getTime(); 
		}
		
		return commonservices;
	}])
	.factory('globalUpdateServices' ,  ['$state' , '$rootScope' , '$window', function ($state , $rootScope , $window) {
		var globalUpdateServices = this;
		globalUpdateServices.updateSideBar = function (index){
            $rootScope._toggleClass = index;
            switch(index){
                case 1 :  { 
                    $rootScope._navheaderTitle = "Dashboard";
                    break;
                }
                case 2 :  { 
                    $rootScope._navheaderTitle = "Billing";
                    break;
                }
                case 3 :  { 
                    $rootScope._navheaderTitle = "Inventory";
                    break;
                }
                case 4 :  { 
                    $rootScope._navheaderTitle = "Store";
                    break;
                }
                case 5 :  { 
                    $rootScope._navheaderTitle = "Orders";
                    break;
                }
                case 6 :  { 
                    $rootScope._navheaderTitle = "Partners";
                    break;
                }
                case 7 :  { 
                    $rootScope._navheaderTitle = "Admin";
                    break;
                }
                case 8 :  { 
                    $rootScope._navheaderTitle = "Customer";
                    break;
                }
                case 9 :  { 
                    $rootScope._navheaderTitle = "Reports";
                    break;
                }
                case 10 :  { 
                    // $rootScope._navheaderTitle = "";
                    break;
                }
                case 11 :  { 
                    $rootScope._navheaderTitle = "Daily Sales";
                    break;
                }case 12 :  {

                    $rootScope._navheaderTitle = "Invoice List";
                    break;
                }
                case 13 :  { 
                	$rootScope._navheaderTitle = "";
                    $rootScope._navheaderTitle = "Add Inventory";
                    break;
                }
                case 14 :  {
                	$rootScope._navheaderTitle = "";
                    $rootScope._navheaderTitle = "Inventory List";
                    break;
                }
                case 15 :  { 
                	$rootScope._navheaderTitle = "";
                    $rootScope._navheaderTitle = "Inventory History";
                    break;
                }
                case 16 :  { 
                	$rootScope._navheaderTitle = "Vendor";
                    break;
                }
                default : break;
            }
            return index;
        }
        return globalUpdateServices;
	}])
});