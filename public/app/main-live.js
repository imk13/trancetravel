/**
 * App files lazy loading config (live),
 * @author : MK
 **/

'use strict';
// function versionName () {
// 	var version = (new Date()).toString().split(':')[0].split(' ').join('_');
// 	return (version.substr(0,version.length-2));
// }
var modulePercent = 0;
require.config({
	urlArgs : "version_09.06.2016::18:20",
	//urlArgs : 'v='+((new Date()).toString().split(':')[0].split(' ').join('_').substr(0 , (new Date()).toString().split(':')[0].split(' ').join('_').length-2)),
	paths : {
		//----------------------lib-min files---------------------------------------------------------------------------------------
		'jquery' : ['//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min', '../bower_components/jquery/dist/jquery.min'],
		'jquery-ui' : ['//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min', '../bower_components/jquery-ui/jquery-ui.min'],
		'angular' : ['//ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min', '../bower_components/angular/angular.min'],
		'ngResource' : ['//ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-resource.min','../bower_components/angular-resource/angular-resource.min'],
		'ngAnimate' : ['//ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-animate.min','../bower_components/angular-animate/angular-animate.min'],
		'ngCookies' : ['//ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-cookies.min','../bower_components/angular-cookies/angular-cookies.min'],
		'angular-sanitize' : ['//ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-sanitize.min','../bower_components/angular-sanitize/angular-sanitize.min'],
		//---------------^files served from google cdn^----------------------------------------------------------------------------
		'ui.router' : ['//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.15/angular-ui-router.min', '../bower_components/angular-ui-router/release/angular-ui-router.min'],
		'angular-block-ui' : ['../bower_components/angular-block-ui/dist/angular-block-ui.min'],
		'angular-growl' : ['../bower_components/angular-growl/dist/angular-growl.min'],
		'angular-file-upload' : ['//cdnjs.cloudflare.com/ajax/libs/angular-file-upload/2.2.0/angular-file-upload.min','../bower_components/angular-file-upload/dist/angular-file-upload.min'],
		'ui-bootstrap' : ['//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.14.3/ui-bootstrap-tpls.min','../bower_components/angular-bootstrap/ui-bootstrap-tpls.min'],
		'bootstrap' : ['//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min','../bower_components/bootstrap/dist/js/bootstrap.min'],
		'sweetalert' : ['//cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min','../bower_components/sweetalert/dist/sweetalert.min'],
		'textAngular': ['../bower_components/textAngular/dist/textAngular.min'],
		'textAngular-sanitize': ['../bower_components/textAngular/dist/textAngular-sanitize.min'],
		'textAngular-rangy': ['../bower_components/textAngular/dist/textAngular-rangy.min'],
		'hot_keys': ['../bower_components/angular-hotkeys/dist/hotkeys.min'],
		'ng_map' : ['../bower_components/ngmap/dist/ng-map.min'],
		'google_map' : ['../components/js/google-map.min?key=AIzaSyCIVjGSWnmZVWULKtUTiVdjnMJhUyHgY88', '//maps.googleapis.com/maps/api/js?key=AIzaSyCIVjGSWnmZVWULKtUTiVdjnMJhUyHgY88'],
		'google_apis' : ['//maps.googleapis.com/maps/api/js?key=AIzaSyCIVjGSWnmZVWULKtUTiVdjnMJhUyHgY88&libraries=places'],
		//	'angular-offline' : '../bower_components/angular-offline/angular-offline.min',
		//---------------^files served from other cdn^----------------------------------------------------------------------------
		
		//---------------files served from FBCDNs----------------------------------------------------------------------------
		//'fb_apis' : ["//connect.facebook.net/en_US/sdk.js"],
		//---------------^files served from FBCDNs^----------------------------------------------------------------------------
		//---------------app-init files------------
		'trance_Controller' : 'tranceController',
		'global_Services' : '/components/js/globalServices',
		'indexed_DBServices' : '/components/js/indexedDBServices',
		'account_Login_Services' : '/app/user/accountLoginServices',
		//-------------trance lazy-loading files---------
		'app' : 'app',
		'common_Controller' : '/components/js/commonController',
		'dashboard_Controller' : '/app/dashboard/dashboardController',
		'dashboard_Services' : '/app/dashboard/dashboardServices',
		'user_Controller' : '/app/user/userController'
		//----------------------------------------------------//
	},

	shim : {
		'bootstrap' : {
			deps : ['jquery']
		},
		'angular': {
			deps : ['jquery' , 'sweetalert' , 'bootstrap'],
	        exports: 'angular'
	      },
	    'ui-bootstrap' : {
			deps : ['angular'],
		},
		'ng_fb' : {
			deps : ['angular' , 'fb_apis'],
			exports : 'angular'
		},
		'ng_map' : {
			deps : ['angular', 'google_apis'],
			exports : 'angular'
		},
		'hot_keys': {
			deps: ['angular'],
			exports: 'angular'
		},
		'ngResource': {
	          deps: ['angular'],
	          exports: 'angular'
	      },
	    'ngCookies': {
	          deps: ['angular'],
	          exports: 'angular'
	      },
	    'ngAnimate': {
	          deps: ['angular'],
	          exports: 'angular'
	      },
	    'ui.router': {
	          deps: ['angular'],
	          exports: 'angular'
	      },
	    'angular-growl': {
	          deps: ['angular'],
	          exports: 'angular'
	      },
	    'angular-block-ui' : {
	    	deps: ['angular'],
	         exports: 'angular'
	    },
	    'angular-file-upload' : {
	    	deps: ['angular'],
	         exports: 'angular'
	    },

	    'textAngular-sanitize' : {
	    	deps : ['angular'],
	    	exports : 'textAngular-sanitize'
	    },
	    
	    'textAngular': {
			deps: ['angular', 'textAngular-sanitize', 'textAngular-rangy'],
			exports : 'textAngular'
		},

		'angular-sanitize': {
	    	deps: ['angular'],
	    	exports: 'angular'
	    },

	    'global_Services' : {
	    	deps : ['angular'],
	    	exports : 'angular'
	    },
	    'indexed_DBServices' : {
	    	deps : ['angular'],
	    	exports : 'angular'
	    },

	    'trance_Controller' : {
			deps : ['angular'],
			exports: 'angular'
		},
	},
	onNodeCreated: function(node, config, moduleName, url) {
		console.log('module ' + moduleName + ' is about to be loaded');
		var moduleLoadProgress = document.getElementById('module-load-progress');
		moduleLoadProgress.style.transition = ("width " + '1s');
		node.addEventListener('load', function() {
			modulePercent += 10;
			if(modulePercent <= 100) {
				//moduleLoadProgress.innerHTML = modulePercent;
				moduleLoadProgress.style.width = (modulePercent + '%');
			}else{
				moduleLoadProgress.style.display = "none";
			}
			console.log('module ' + moduleName + ' has been loaded ' + (modulePercent) + '%');
		});

		node.addEventListener('error', function() {
			console.log('module ' + moduleName + ' has failed to be loaded');
			moduleLoadProgress.style.background = "rgba(255, 0, 0, 0.5)";
		});
	},
	waitSeconds: 50,
	baseUrl: '/app'
});
var rootDep = ["angular", "ui-bootstrap", "ui.router" , "ngResource", 'google_apis'];
define(rootDep, function (reqDeps) {
	console.log(reqDeps);

	require(['account_Login_Services' , 'trance_Controller' , 'global_Services' , 'indexed_DBServices'], function () {
		angular.bootstrap(document , ['tranceTravel']);
		console.log("app bootstraped")
	} , function (error) {
		alert(error);
		console.info(error);
	});
} , function (error) {
	console.info(error);
});
