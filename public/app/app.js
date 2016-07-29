/**
 * App module instantiation
 * @author : MK
 **/
'use strict';
define([],function () {
	//.................................app instantiated....................................
	var app = angular.module("tranceTravel", ['ui.router' , 'ngResource', 'ui.bootstrap']);

    //console.log(app);
	//.....................................................................................
	return app;
});