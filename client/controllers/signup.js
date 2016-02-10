(function() {
    'use strict';

    angular
        .module('Instagram')
        .controller('SignupCtrl', SignupCtrl);

    SignupCtrl.$inject = ['$scope', '$rootScope', '$auth', '$timeout', '$location', '$window'];

    /* @ngInject */
    function SignupCtrl($scope, $rootScope, $auth, $timeout, $location, $window) {
        $scope.signup = signup;

        function signup() {
            var user = {
                    username: $scope.username,
                    email: $scope.email,
                    password: $scope.password
                }
                //this is a satellizer service that does post,get requests to our server
            $auth.signup(user).then(function(res) {
                //successful signup
                console.log(res, "signup success");
                // $window.localStorage.currentUser = JSON.stringify(res.data);
                // $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
                //notify signup success and take to login page
                if (res.status == 200) {
                    $location.path('/login');
                };
            }).catch(function(response) {
                $scope.errorMessage = {};
                console.log(response.data, "fail signup");

                angular.forEach(response.data.message, function(message, field) {
                    //this sets the validity of our custom ngmessage  prop
                    //ex:emailNotUnique,usernameNotUnique
                    $scope.signupForm[field].$setValidity('serverError', false);
                    //this sets the error message to the ng-message field[email,password,username]
                    $scope.errorMessage[field] = response.data.message[field];
                }); //forEAch
                $timeout(function() {
                    $scope.errorMessage = {};
                    $scope.password = '';
                }, 3500);

            }); //$auth.signup
        } //signup
    }; //SignupCtrl
})();
