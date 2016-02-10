(function() {
    'use strict';

    angular
        .module('Instagram')
        .controller('uploadCtrl', uploadCtrl);

    uploadCtrl.$inject = ['$rootScope', '$scope', 'Api', 'fileReader'];

    /* @ngInject */
    function uploadCtrl($rootScope, $scope, Api, fileReader) {
        //this token will be attached to the upload template
    	var token = Api.getUserToken();
    	$scope.token = token;
     //   $scope.imageSrc = 'http://localhost:3000/userUploads/02d83b90-4e6f-11e5-af99-2ba576f40877.jpeg';
    	
        //this is called in the directive [fileUpload] once a change event is fired
        // $scope.getFile = function() {
        //     $scope.progress = 0;
        //     console.log(($scope.file.size / 1024), 'kb');
        //     console.log($scope.file);
        //     if (!($scope.file.type.match(/image\/*/))) {
        //         //if not a image dont process furthur
        //         console.log("Not an image type file");
        //         return;
        //     }

        //     fileReader.readAsText($scope.file, $scope).then(function(result) {
        //         //promise resolved
        //         //result is the data url
        //         // $scope.imageSrc = result;
        //         // console.log(result);
        //         console.log(result);
        //         var photoDetails = {
        //             lastModified: $scope.file.lastModified,
        //             name: $scope.file.name,
        //             size: $scope.file.size,
        //             type: $scope.file.type
        //         }
        //         var obj = {
        //                 data: result,
        //                 photoDetails: photoDetails,
        //                 postedBy: $rootScope.currentUser._id
        //             }
        //             //now lets send the dataUrl to the mongodb

        //         Api.uploadPhoto(obj).then(function(response) {
        //             //response from server after image saved in db successfully

        //         }); //Api.upload



        //     }); //readAsDAtaUrl
        // }; //getFile

        //progress braodcast listener


    } //uploadCtrl controler
})();
