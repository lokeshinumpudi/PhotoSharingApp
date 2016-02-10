(function() {
    'use strict';

    angular
        .module('Instagram')
        .directive('showComments', showComments);

    showComments.$inject = ['Api'];

    /* @ngInject */
    function showComments(Api) {
        // Usage:
        //render the comments on a post
        // Creates:
        //
        var directive = {
            restrict: 'E',
            link: link,
            templateUrl:'../views/templates/showComments.html'

        };
        return directive;

        function link(scope, element, attrs) {
            console.log(element);
            //commentsForId(loads async):id of the post for which comments are to be fetched
            scope.$watch(function() {
                return attrs.commentsforpostid;
            }, function(newVal, oldVal) {

                if (newVal) {
                    //newVal :the postId 
                    scope.postId = newVal;
                    initComments(newVal);
                }; //only when a new Val

            }); //$scope.$watch

            function initComments(postId) {
                //fetches 6 comments that are latest as of now time
                Api.getMoreComments(postId, {
                    time: Date.now()
                }).then(function(response) {

                    scope.comments = response.data;
                });
            } //initComments

            //click more comments load

            function loadMoreComments(lastCommentTime) {
                if (!(typeof parseInt(lastCommentTime) === "number")) {
                    return;
                };
                if (scope.postId) {
                    //make a request to the endpoint 
                    Api.getMoreComments(scope.postId, {
                        time: lastCommentTime
                    }).then(function(response) {
                        //response.data:array of the old comments
                        if (response.data) {
                            //if response.data.length == 0 [no more comments]
                            response.data.forEach(function(comment) {
                                //show some visual feedback to say new comments are loaded
                                scope.comments.push(comment);

                            });
                        }; //if response.data
                    }); //Api.getMoreComments


                };
            } //loadMoreComments fnc
            scope.loadMore = function() {
                if (scope.comments) {
                    //get the time of the last comment
                    var lastcommmenttime = scope.comments[scope.comments.length - 1].commentByUserAt;
                    //make a call to load comments older than the last commen time
                    if (typeof parseInt(lastcommmenttime) == "number") {
                        loadMoreComments(lastcommmenttime);

                        var commentSection = document.querySelector('.comments-section');
                        console.log(commentSection.scrollTop);
                        // commentSection.scrollTop += 20;

                        console.log(commentSection.scrollHeight);
                    };

                };
            };
           

        } //link fnc for the directive

    } //showComments
})();
