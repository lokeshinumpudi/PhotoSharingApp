(function() {
    'use strict';

    angular
        .module('Instagram')
        .directive('serverError', serverError);

    // serverError.$inject = [];

    /* @ngInject */
    function serverError() {
        // Usage:
        //clear the error messages on keydown on this directive attached input eles
        // Creates:
        //none
        var directive = {
            link: link,
            require: 'ngModel',
            restrict: 'A',

        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            //ctrl is the ngModel controller functionality from parent scope 
            // retreived from the require prop
            element.on('keydown', function() {
                ctrl.$setValidity('serverError', true);
                ctrl.$setValidity('commentError',true);
            })

        } //link fnc
    } //serverError directive 
})();
