(function() {
    'use strict';

    angular
        .module('Instagram')
        .controller('userProfileCtrl', userProfileCtrl);

    userProfileCtrl.$inject = ['Api', '$scope', '$routeParams'];

    /* @ngInject */
    function userProfileCtrl(Api, $scope, $routeParams) {
        //get the profile data
        var username = $routeParams.username.slice(1)
        Api.getUserProfile(username).success(function(data) {
            $scope.profile = data[0];
            $scope.photos = {};

            data[0].posts.forEach(function  (post) {
                    $scope.photos[post._id] = post.images;
            });
            console.log(data[0],"data");
            console.log($scope.photos);
        }); //Api.success



    } //userProfileCtrl ctrl
})();
