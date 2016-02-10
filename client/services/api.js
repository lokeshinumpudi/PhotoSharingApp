(function() {
    'use strict';

    angular
        .module('Instagram')
        .factory('Api', Api);
    Api.$inject = ['$http', '$window', 'Constants'];
    /* @ngInject */
    function Api($http, $window, Constants) {
        //get the rest endpoint from Constants.serverurl+host
        // var endpoint = Constants.serverurl + ":" + Constants.host;
        var endpoint = "http://localhost:3000";

        $http.defaults.headers.common['X-Requested-With'];
        var service = {
            getInstagramFeed: getInstagramFeed,
            getMediaById: getMediaById,
            likeMedia: likeMedia,
            uploadPhoto: uploadPhoto,
            getUser: getUser,
            getUserToken: getUserToken,
            getUserUploads: getUserUploads,
            getHomeFeed: getHomeFeed,
            getPhotoDetails: getPhotoDetails,
            postCommentOnPost: postCommentOnPost,
            getMoreComments: getMoreComments,
            postLike: postLike,
            getUserProfile: getUserProfile
        };
        return service;


        function getMoreComments(postid, obj) {
            //postId: post for which comments should be loaded
            //obj: time,id of last received comment
            console.log(obj);
            if (!obj.time) {
                return;
            };

            return $http({
                method: 'GET',
                url: endpoint + '/getMoreComments',
                params: {
                    postId: postid,
                    lastCommentTime: obj.time
                }
            });

        } //getMoreComments


        function postLike(postId) {
            return $http.post(endpoint + "/likes", {
                postId: postId
            });
        } //posTLike

        function postCommentOnPost(postId, commentObj) {
            return $http.post(endpoint + '/comments', {
                postId: postId,
                commentObj: commentObj
            });
        } //postCommentOnPost

        function getHomeFeed() {
            return $http.get(endpoint);
        } //getHomeFeed

        function getPhotoDetails(photoId) {
            return $http.get(endpoint + '/photo/' + photoId);
        } //getPhotoDetails

        function getUser() {
            if ($window.localStorage.currentUser) {
                return JSON.parse($window.localStorage.currentUser);
            } else {
                var error = {
                    error: "NOT LOGGED IN :log in to see your uploades"
                }
                return error;
            } //if else 
        } //getUSer

        function getUserToken() {
            if ($window.localStorage.satellizer_token) {
                return $window.localStorage.satellizer_token;
            } else {
                return null;
            }
        } //getUserToken

        //returns user uploads given his _id
        function getUserUploads(userid) {

            return $http({
                url: endpoint + '/uploads',
                method: 'GET',
                data: {
                    userId: userid
                }
            }); //$http
        } //getUSerUploads

        function getInstagramFeed(no) {
            return $http.get(endpoint + '/api/feed', {
                feedCount: no
            });
        } //getInstagramFeed

        function getMediaById(id) {
            return $http.get(endpoint + '/api/' + id);
        }

        function likeMedia(id) {
            return $http.post(endpoint + '/api/like', {
                mediaId: id
            });
        }

        function getUploads(obj) {
            //obj is the logged in user data
            return $http({
                url: endpoint + '/uploads',
                method: 'GET',
                data: {
                    userId: obj.userId
                }
            });
        }

        function uploadPhoto(obj) {
            console.log(obj);
            return $http({
                url: endpoint + '/upload',
                method: 'POST',
                data: {
                    data: obj.data,
                    photoDetails: obj.photoDetails,
                    postedBy: obj.postedBy
                }
            });
        } //uploadPhoto

        function getUserProfile(username) {

            return $http({
                method: 'GET',
                url: endpoint + '/getUserProfile',
                params: {
                    username: username
                }
            });
        } //getUserProfile
    } //APi factory
})();
