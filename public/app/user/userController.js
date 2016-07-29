'use strict';

define(['app'] , function (app) {
	console.log(app);

	app.registerController("accountController" , ['$rootScope' , '$scope' , '$state' , '$window' , 'accountService', 'fbServices',
		function ( $rootScope , $scope , $state , $window, accountService, fbServices) {
		console.log("accountController");
		$scope.newUser = {};
		$scope.submitNewUserData = function () {
			var userInfo = {};
			userInfo.first_name = $scope.newUser.first_name;
			userInfo.last_name = $scope.newUser.last_name ? $scope.newUser.last_name  : "";
			userInfo.contact_number = $scope.newUser.phone;
			userInfo.email = $scope.newUser.email;
			userInfo.password = $scope.newUser.password1;
			userInfo.social_id = {'id' : new Date , 'social' : "none"};
			userInfo.role = "client";
			if($scope.newUser.password1 === $scope.newUser.password2) {
				accountService.create_user.createUser({} , userInfo , function (response) {
					console.log(response);
					$state.go("home.login");
				}, function (error){
					console.log("error");
				})
			}else{
				alert("password dont match")
			}
		};
	}]);

	app.registerController("loginController" , ['$rootScope' , '$scope' , '$state' , '$window' , 'loginService','fbServices',
		function ( $rootScope , $scope , $state , $window, loginService, fbServices) {
		console.log("loginController");
		$scope.auth = {};
		$scope.auth.login =function () {
			var loginInfo = {};
			if($scope.auth.user && $scope.auth.password) {
				loginInfo.email = $scope.auth.user;
				loginInfo.password = $scope.auth.password;
				loginInfo.role = "client";
				loginService.user_login.userLogin({role : loginInfo.role} ,  loginInfo , function (response) {
					console.log(response);
					loginService.setCurrentUser(loginInfo.email);
					loginService.setToken(response._id);
					$state.go("home.view.content.dashboard");
				}, function (error) {
					console.log(error);
				})
			}else{
				alert("Please input email & password");
			}
		}

		$scope.fbLogin = function () {
			console.log("fbLogin");
			fbServices.login().then(function (response) {
				console.log(response);
				$state.go("home.view.content.dashboard");
			}, function (error) {
				console.log(error);
			})
		};

		$scope.googleLogin = function () {
			console.log("coming soon...");
		}
	}]);
})