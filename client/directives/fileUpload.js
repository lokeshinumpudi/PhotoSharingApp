(function() {
    'use strict';

    angular
        .module('Instagram')
        .directive('fileUpload', fileUpload);

    fileUpload.$inject = ['Api'];

    /* @ngInject */
    function fileUpload(Api) {
        var directive = {
            // controller: uploadCtrl,
            // bindToController: true,

            link: link,
            restrict: 'A',
        };
        return directive;

        function link(scope, ele, attrs) {
            //now bind a change event listener to the element
            ele.bind('change', function(e) {
                //now attach the file details to the scope
                console.log("Ahh file my event fired");
                scope.file = (e.target || e.srcElement).files[0];
                //now we have the file ,lets start reading it
                //call a controller to handle fileReading[through a factory]
                scope.getFile();
            }); //bind change eventlistener
        } //link
    } //fileUpload factrory



})();

