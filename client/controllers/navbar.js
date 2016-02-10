(function() {
    'use strict';

    angular
        .module('Instagram')
        .controller('navCtrl', navCtrl);

    navCtrl.$inject = ['$window', '$location', 'Api', '$scope', '$auth'];

    /* @ngInject */
    function navCtrl($window, $location, Api, $scope, $auth) {

        $scope.isAuthenticated = isAuthenticated;
        $scope.logout = logout;


        function isAuthenticated() {
            return $auth.isAuthenticated();
        }

        //logout
        function logout() {
            $window.localStorage.removeItem('currentUser');
            $auth.logout();
            //redirect to home page
            $location.path('#/');
        } //logout
    } //navCtrl controller
})();
