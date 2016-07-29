/**
 * App files lazy loading config (stg),
 * @author : MK
 **/
'use strict';
// function versionName () {
// 	var version = (new Date()).toString().split(':')[0].split(' ').join('_');
// 	return (version.substr(0,version.length-2));
// }
require.config({
	urlArgs : 'v='+((new Date()).toString().split(':')[0].split(' ').join('_').substr(0 , (new Date()).toString().split(':')[0].split(' ').join('_').length-2)),
	paths : {
		//----------------------lib-min files-------------------
		'angular' : '../bower_components/angular/angular.min',
		'jquery' : '../bower_components/jquery/dist/jquery.min',
		'jquery-ui' : '../bower_components/jquery-ui/jquery-ui.min',
		'ngResource' : '../bower_components/angular-resource/angular-resource.min',
		'ngAnimate' : '../bower_components/angular-animate/angular-animate.min',
		'ngCookies' : '../bower_components/angular-cookies/angular-cookies.min',
		'ui.router' : '../bower_components/angular-ui-router/release/angular-ui-router.min',
	//	'angular-offline' : '../bower_components/angular-offline/angular-offline.min',
		'angular-block-ui' : '../bower_components/angular-block-ui/dist/angular-block-ui.min',
		'angular-sanitize' : '../bower_components/angular-sanitize/angular-sanitize.min',
		'angular-growl' : '../bower_components/angular-growl/dist/angular-growl.min',
		'bootstrap' : '../bower_components/bootstrap/dist/js/bootstrap.min',
		'ui-bootstrap' : '../bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
		'angular-file-upload' : '../bower_components/angular-file-upload/dist/angular-file-upload.min',
		'sweetalert' : '../bower_components/sweetalert/dist/sweetalert.min',
		'textAngular': '../bower_components/textAngular/dist/textAngular.min',
		'textAngular-sanitize': '../bower_components/textAngular/dist/textAngular-sanitize.min',
		'textAngular-rangy': '../bower_components/textAngular/dist/textAngular-rangy.min',
		'hot_keys': '../bower_components/angular-hotkeys/build/hotkeys.min',
		//---------------hyperlocal-init files------------
		'hlpApp' : 'app',
		'global_Services' : '../components/js/globalServices',
		'indexed_DBServices' : '../components/js/indexedDB',
		'hyperlocalApp_routes' : 'hyperlocalApp.routes',
		'hyperlocalApp_controller' : 'hyperlocalApp.controller',
		//-------------hyperlocal lazy-loading files---------
		'store_Services' : 'store_settings/storeServices',
		'store_Controller' : 'store_settings/store.controller',
		//----------------------------------------------------//
		'billing_Product_Services' : 'billing/productServices',
		'billing_Controller' : 'billing/billing.controller',
		'billing_Payment_Controller' : 'billing/billPaymentController',
		'billing_Invoices_Controller' : 'billing/invoicesController',
		//----------------------------------------------------------//
		'business_Controller' : 'business/businessController',
		'business_Services' : 'business/businessServices',
		//----------------------------------------------------------//
		'inventory_Services' : 'inventory/inventoryServices',
		'inventory_Controller' : 'inventory/inventoryController',
		//---------------------------------------------------------//
		'account_Services' : 'account/accountServices',
		'account_Controller' : 'account/account.controller',
		//--------------------------------------------------------//
		'login_Controller' : 'login/login.controller',
		//--------------------------------------------------------//
		'dashboard_Services' : 'dashboard/dashboardServices',
		'dashboard_Controller' : 'dashboard/dashboard.controller',
		//--------------------------------------------------------//
		'partner_Services' : 'partner/partnerServices',
		'partner_Controller' : 'partner/partnerController',
		//--------------------------------------------------------//
		'report_services': 'reports/reportService',
		//--------------------------------------------------------//
		'order_Controller' : 'orders/orderController',
		'order_Services' : 'orders/orderServices',
		//--------------------------------------------------------//
		'common_Controller' : '../components/js/common.controllers',
		//----------------------------------------------------------//
		'print_Invoice_Controller' : '../components/js/printInvoiceController',
		//------------------------------------------------------------//
		'customer_Controller' : 'customer/customerController',
		'wallet_Services' : 'customer/customerWalletServices',
		//------------------------------------------------------------//
		'report_Controller' : 'reports/reportController',
		'listing_Controller' : '../components/js/listingController'
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
	    	exports : 'angular'
	    },

	    'textAngular': {
			deps: ['angular', 'textAngular-sanitize' , 'textAngular-rangy'],
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
	    'storeServices' : {
	    	deps : ['angular'],
	    	exports : 'angular'
	    },
	    'hyperlocalApp_routes' : {
			deps : ['angular' , 'global_Services' , 'indexed_DBServices' , 'store_Services'],
			exports: 'angular'
		},
		'hyperlocalApp_controller' : {
			deps : ['angular'],
			exports: 'angular'
		}
	},
	waitSeconds: 30,
	baseUrl: '../app'
});

require(["bootstrap", "ui-bootstrap", "ui.router" , "ngResource", "ngCookies", "angular-growl" , "ngAnimate", 'angular-block-ui' , 'angular-file-upload', 'textAngular', 'hot_keys'], function (textAngular) {
	require(['hyperlocalApp_controller' , 'hyperlocalApp_routes'], function () {
		angular.bootstrap(document , ['hyperLocalApp']);
	});
});
