(function() {
    'use strict';

    angular
        .module('Instagram')
        .controller('DetailCtrl', DetailCtrl);

    DetailCtrl.$inject = ['$routeParams', '$rootScope', '$scope', '$window', 'Api', '$auth'];

    /* @ngInject */
    function DetailCtrl($routeParams, $rootScope, $scope, $window, Api, $auth) {
        //this is the feed id
        // var mediaId = $routeParams.id;
        // API.getMediaById(mediaId).success(function(media) {
        //     $scope.hasLiked = media.user_has_liked;
        //     $scope.photo = media;
        // });

        // $scope.like = function() {
        //     $scope.hasLiked = true;
        //     Api.likeMedia(mediaId).error(function(data) {
        //         sweetAlert('Error', data.message, 'error');
        //     });photoDetail
        // };

        var photoId = $routeParams.id;
        Api.getPhotoDetails(photoId).then(function(photoDetails) {

            if (photoDetails.data.error == "noAuth") {
                //if no auth [show login to engage in it]    
                $scope.isAuthToShowDetail = false;
                return;
            };
            $scope.isAuthToShowDetail = true;
            $scope.photoDetail = photoDetails.data;
            $scope.islikedByUser = $scope.photoDetail.islikedByUser;
            console.log($scope.photoDetail, "details");
        }); //getPhotoDetails
        $scope.postComment = postComment;
        $scope.postLike = postLike;
        $scope.isAuthenticated = isAuthenticated;

        function isAuthenticated() {
            // body...
            return $auth.isAuthenticated();
        } //isAuthenticated fnc end

        function postComment(postId) {
            //postId :is the mongodb _id of the image storage
            var comment = $scope.comment;
            console.log($scope);
            if (!comment) {
                //show info to type some message but not empty
                //setValidity[boolean]:can be set on a  prop attached to ng-message
                //ex    <div ng-message="testError">{{testErrorContent}}  </div>
                //                  formName.modelName.$setValidity(testError,false);
                //  if  (true): message bound to the ngMessage is hidden
                //if (false ):means the form is dirty or error
                $scope.postCommentForm['comment'].$setValidity('commentError', false);
                $scope.enterCommentErrorText = "Enter comment! empty not accepted";
                return;
            };

            if (!isAuthenticated()) {
                //user not authenticated
                $scope.postCommentForm['comment'].$setValidity('authError', false);
                $scope.authToCommentErrorText = "Login to engage in comments";


            };
            var commentObj = {
                comment: comment,
                commentByUserAt: Date.now(),
            };
            //push comment locally
            var postedUser = $scope.photoDetail.postedUser;
            var pushObj = {
                commentByUserAt: commentObj.commentByUserAt,
                commentByUserId: postedUser.userId,
                commentByUserName: postedUser.username,
                commentByUserPicture: postedUser.picture,
                comment: comment

            };

            $scope.photoDetail.comments.push(pushObj);
            console.log(comment);
            //do some validations on the comment[spam,strong language]

            Api.postCommentOnPost(postId, commentObj).then(function(response) {
                console.log(response.data);
            });

            //clear the message
            $scope.comment = "";
        }; //postComment fnc
        $scope.locallikes = {};

        function postLike(postId, islikedByUserAlready) {
            //postId:the post on which user liked
            //islikedByUserAlready: boolean [shows if user liked it already or not]
            if (!isAuthenticated()) {
                //tell him to login to make likes
                console.log("login to like");
                return;
            };
            //this is server data check to prevent multiple like submit
            if (islikedByUserAlready) {
                //maybe animate the like again 
                return;
            };
            if ($scope.locallikes[postId]) {
                //local check
                return;
            };
            //local check to prevent multiple likes [cause we dont have heavy sync]
            $scope.locallikes[postId] = true;
            $scope.islocalLike = true;
            //like endpoint
            Api.postLike(postId).then(function(res) {
                console.log(res);
            });

        } //postLike fnc end
    }; //HomeCtrl controller fnc
})();
