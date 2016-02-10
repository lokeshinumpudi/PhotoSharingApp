(function() {
    'use strict';

    angular 
        .module('Instagram', [
            'ngRoute',
            'ngMessages',
            'satellizer',
            'ngMaterial'
        ])
        .constant('Constants',{
            "serverurl": "http://159.203.69.228",
            "host":"3000"
        })
        .config(config)
        .run(run);
    // config function
    config.$inject = ['$routeProvider', '$authProvider', '$httpProvider'];
    function config($routeProvider, $authProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl',

            })
            .when('/user/:username',{
                templateUrl:'views/userProfile.html',
                controller:'userProfileCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl',

            })
            .when('/signup', {
                templateUrl: 'views/signup.html',
                controller: 'SignupCtrl',

            })
            .when('/upload',{
                templateUrl:'views/upload.html',
                controller:'uploadCtrl'
            })
            .when('/myUploads',{
                templateUrl:'views/myUploads.html',
                controller:'myUploadsCtrl'
            })
            .when('/photo/:id', {
                templateUrl: 'views/detail.html',
                controller: 'DetailCtrl',

            })
            .otherwise('/');


        //allow cross domain calls[cause if i host the node server seperately with client]
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        // Auth config
        //server end points that handle our login,signup flows
        //satellizer will send a post req on these end points when $auth.login,$auth.signup are called
        $authProvider.loginUrl = 'http://localhost:3000/auth/login';
        $authProvider.signupUrl = 'http://localhost:3000/auth/signup';

        $authProvider.oauth2({
            name: 'instagram',
            url: 'http://localhost:3000/auth/instagram',
            redirectUri: 'http://localhost:8000/client',
            clientId: '7f4551c0b41a41b49325d7def4680785',
            requiredUrlParams: ['scope'],
            scope: ['likes'],
            scopeDelimiter: '+',
            authorizationEndpoint: 'https://api.instagram.com/oauth/authorize'
        });

    }; //config[$routeProvider] fnc


    //load the user in localStorage once the app is loaded
    //to prevent flickering of the data
     run.$inject = ['$rootScope', '$auth', '$window'];

    function run($rootScope, $auth, $window) {
                // if ($window.localStorage.currentUser && $window.localStorage.currentUser != "undefined") {
                //     // console.log($window.localStorage.currentUser);
                //     $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
                // };
    }; //run


})();
