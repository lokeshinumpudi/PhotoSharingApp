(function() {
    'use strict';

    angular
        .module('Instagram')
        .directive('likeHandle', likeHandle);

  //  likeHandle.$inject = [];

    /* @ngInject */
    function likeHandle () {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: Controller,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            scope: {
            }
        };
        return directive;

        function link(scope, ele, attrs) {

        	var elechild = ele.children();
        	var likebtn = elechild[0];
        	var likeCounter =elechild[1]
        
        			function clickhandler (e) {
        				//stop furthur event delegation
        			       e.stopImmediatePropagation();

        			       

        			}//clickhandler
        			//add click listener to the first span
        		likebtn.addEventListener("click",clickhandler,false);



        }//link fnc to the directive
    }//likeHanlde directive

    /* @ngInject */
    function Controller () {

    }
})();