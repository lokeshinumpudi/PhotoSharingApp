(function() {
    'use strict';

    angular
        .module('Instagram')
        .controller('myUploadsCtrl', myUploadsCtrl);

    myUploadsCtrl.$inject = ['$scope','Api','$location'];

    /* @ngInject */
    function myUploadsCtrl($scope,Api,$location) {
        //get logged in user 
        var user = Api.getUser();
       
        if (!user.error) {
            //now get loggeduser uploads from '/uploads' endpoint
            Api.getUserUploads(user._id).then(function(response) {
                var photos = response.data;
                console.log(photos);
                $scope.userUploads = photos;
            }); //APi.getUSerUploads
        }else{
            //user not logged in
            //redirect to home
            console.log(user);
            $location.path('/');
        }//if/else user/user.error

    } //myUloadCtrl controller
})();
