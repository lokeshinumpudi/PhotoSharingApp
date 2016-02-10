(function() {
    'use strict';

    angular
        .module('Instagram')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$scope', '$window', '$location', '$rootScope', '$auth'];

    /* @ngInject */
    function LoginCtrl($scope, $window, $location, $rootScope, $auth) {

        $scope.instagramLogin = instagramLogin;
        $scope.emailLogin = emailLogin;


        function instagramLogin() {
            $auth.authenticate('instagram')
                .then(function(response) {
                    //store the json auth data in localstorage
                    console.log(response);
                    $window.localStorage.currentUserToken = JSON.stringify(response.data.token);
                    //now save it to teh rootScope [parsed into js objects]
                     $rootScope.currentUser = JSON.parse(response.data.user);
                }); //$auth.authenticate promise
        }; //instagramLogin fnc

        function emailLogin() {
            $auth.login({
                    email: $scope.email,
                    password: $scope.password
                })
                .then(function(response) {
                    //store the json auth data in localstorage
                    //show auth success and take him to home page
                    console.log(response);
                    $window.localStorage.currentUserToken = JSON.stringify(response.data.token);
                    //now save it to teh rootScope [parsed into js objects]
                    $rootScope.currentUser = response.data.user;
                    $location.path("/");
                })
                .catch(function(response) {
                    $scope.errorMessage = {};
                    console.log(response.data);
                    angular.forEach(response.data.message, function(message, field) {
                            $scope.loginForm[field].$setValidity('serverError', false);
                            $scope.errorMessage[field] = response.data.message[field];
                        }) //forEAch
                }); //$auth.login promise
        }; //emailLogin fnc

    }; //LoginCtrl fnc end
})();
