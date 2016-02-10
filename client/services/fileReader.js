(function() {
    'use strict';

    angular
        .module('Instagram')
        .factory('fileReader', fileReader);

    fileReader.$inject = ['$q', '$log'];

    /* @ngInject */
    function fileReader($q, $log) {

        //resolve|reject the methods

        var onload = function(reader, deferred, scope) {
                //resolve after doing scope.$apply
                return function() {
                        scope.$apply(function() {
                            deferred.resolve(reader.result);
                        }); //scope.$apply
                    } //return
            } //onload

        var onerror = function(reader, deferred, scope) {
                return function() {
                        scope.$apply(function() {
                            deferred.reject(reader.result);
                        }); //scope.$apply
                    } //return
            } //onerror

        var onprogress = function(reader, deferred, scope) {
                //broadcast the onprogress event all across the scope
                return function(event) {
                        scope.$broadcast("fileprogress", {
                            total: event.total,
                            loaded: event.loaded
                        });
                    } //return 

            } //onprogress

        var getReader = function(deferred, scope) {

                var reader = new FileReader();
                //defer all the FileReader events into angular methods
                reader.onload = onload(reader, deferred, scope);
                reader.onerror = onerror(reader, deferred, scope);
                reader.onprogress = onprogress(reader, deferred, scope);

                return reader;
            } //getReader fnc

        var readAsDataURL = function(file, scope) {
                var deferred = $q.defer();
                //getReader returns the [FileReader] instance with angular methods baked
                var reader = getReader(deferred, scope);
                //native filesys api 
                reader.readAsDataURL(file);
                //return the promise that will be resolved

                return deferred.promise;
            } //readAsDataURL method

        var readAsBinaryString = function(file, scope) {
                var deferred = $q.defer();
                var reader = getReader(deferred, scope);
                reader.readAsBinaryString(file);
                return deferred.promise;
            } //readAsBinaryString

        var readAsText = function(file, scope) {
            var deferred = $q.defer();
            var reader = getReader(deferred, scope);
            reader.readAsText(file);
            return deferred.promise;
        }

        var readAsArrayBuffer = function(file, scope) {
            var deferred = $q.defer();
            var reader = getReader(deferred, scope);
            reader.readAsArrayBuffer(file);
            return deferred.promise;
        }

        //return the factory methods
        return {
            readAsDataURL: readAsDataURL,
            readAsBinaryString: readAsBinaryString,
            readAsText: readAsText,
            readAsArrayBuffer: readAsArrayBuffer
        }
    } //fileReader factory
})();
