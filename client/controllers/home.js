(function() {
    'use strict';

    angular
        .module('Instagram')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$scope', '$auth', 'Api', '$location'];

    /* @ngInject */
    function HomeCtrl($scope, $auth, Api, $location) {


        $scope.isAuthenticated = isAuthenticated;
        $scope.linkInstagram = linkInstagram;
        /* if ($auth.isAuthenticated() && ($rootScope.currentUser && $rootScope.currentUser.username)) {
            //user is authenticated and instagram is linked
            if ($window.localStorage.currentUserFeeds) {
                var parsedFeeds = JSON.parse($window.localStorage.currentUserFeeds);
                $scope.instagarmFeeds = parsedFeeds.data;
            }; //get his instagram feeds


            // Api.getInstagramFeed().success(function(feeds) {
            //     //save the feed locally in localStorage in json
            //     $window.localStorage.currentUserFeeds = JSON.stringify(feeds);
            //     console.log(feeds);
            // });
        }; //if $auth&&currentuser
    */

        function isAuthenticated() {
            // body...
            return $auth.isAuthenticated();
        } //isAuthenticated fnc end

        function linkInstagram() {
            $auth.link('instagram')
                .then(function(response) {
                    //link success
                    $window.localStorage.currentUser = JSON.stringify(response.data.user);
                    $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);

                    console.log($rootScope.currentUser.instagramId);
                    //now add user data to the scope
                    //his own feed
                    Api.getFeed().success(function(data) {
                        //promise resolved with a data {from our express backend}
                        console.log(data);
                        $scope.instagramPhotos = data;

                    }); //$scope.photos
                }); //link:promise
        } //linkInstagram fnc

        //get the home feed[no need for auth]

        Api.getHomeFeed().then(function(homefeed) {
            console.log(homefeed);
            if (homefeed.data == "no uploads") {
                $scope.homeFeedAvailable = false;
                return;
            };
           
            $scope.homeFeeds = homefeed.data;
            $scope.homeFeedAvailable = true;

        });
        //this temp is used to store user entered messages in the home fed ui
        $scope.comments = {};
        $scope.postComment = postComment;
        $scope.postLike = postLike;
        $scope.openPostDetail = openPostDetail;

        function postComment(postId) {
            //postId :is the mongodb _id of the image storage

            //this will get the comment attached to the comments[scope],with id as prop
            var comment = $scope.comments[postId];
            //do some validations on the comment[spam,strong language]
            var commentObj = {
                comment: comment,
                commentByUserAt: Date.now(),
            };
            Api.postCommentOnPost(postId, commentObj).then(function(response) {
                console.log(response.data);
            });

            //clear the message
            $scope.comments[postId] = "";
        }; //postComment fnc
        var userliked = {};

        function postLike(postId, islikedByUserAlready) {

            //postId:the post on which user liked
            //islikedByUserAlready: boolean [shows if user liked it already or not]
            if (!isAuthenticated()) {
                //tell him to login to make likes
                console.log("login to like");
                return;
            };
            //this is server data check to prevent multiple like submit
            if (islikedByUserAlready || userliked[postId]) {
                //but this data is available only once the feed reloads or feed is updated once 
                //a user likes a post
                //dont repost like if already liked
                return;
            };
            //like endpoint
            Api.postLike(postId).then(function(res) {
                console.log(res);
            });
            //this is local check to prevent multiple like submit
            userliked[postId] = true;
        } //postLike fnc end

        function openPostDetail(postId) {
            //change the url to the postID for detail
            $location.path("/photo/" + postId);
        } //openPostDetail


    } //HomeCtrl
})();
