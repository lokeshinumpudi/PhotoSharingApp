<!doctype html>
<html ng-app="Instagram">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Instagram - learn</title>
    <link rel="stylesheet" href="vendors/bootstrap/bootstrap-paper.css">
    <!-- <link rel="stylesheet" href="css/styles.css"> -->
    <link rel="stylesheet" href="css/styles.min.css">
</head>

<body>
    <!-- navbar -->
    <div ng-controller="navCtrl" class="navbar navbar-default navbar-static-top">
        <div class="container-fluid">
            <!-- navbar-header -->
            <div class="navbar-header">
                <a href="#/" class="navbar-brand">
                    PhotComp
                </a>
            </div>
            <!-- navbar-header end -->
            <ul class="nav navbar-nav">
                <a href="#/" class="navbar-brand"><i class="ion-images"></i> Instagram</a>
                <li><a href="#/">Home</a></li>
                <li ng-if="!isAuthenticated()"><a href="#/login">Log in</a></li>
                <li ng-if="!isAuthenticated()"><a href="#/signup">Sign up</a></li>
                <li ng-if="isAuthenticated()"><a href="#/upload">upload</a></li>
                <li ng-if="isAuthenticated()"><a href="#/myUploads">My uploads</a></li>
                <li ng-if="isAuthenticated()"><a ng-click="logout()" href="">Logout</a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li ng-if="isAuthenticated() && currentUser.username">
                    <a ng-href="http://instagram.com/{{currentUser.username}}">
                        <img class="media-object img-rounded" ng-src="{{currentUser.picture}}"> @{{currentUser.username}}
                    </a>
                </li>
            </ul>
        </div>
    </div>
    <!-- navbar end -->
    <div ng-view></div>
    <!-- vendor libs -->
    <!-- <script src="vendors/bootstrap/bootstrap.min.js"></script>    -->
   <!--  <script src="vendors/angular/angular.min.js"></script>
    <script src="vendors/angular/angular-route.min.js"></script>
    <script src="vendors/angular/angular-messages.min.js"></script>
    <script src="vendors/satellizer.min.js"></script>
    <script src="app.js"></script>
    <script src="services/api.js"></script>
    <script src="services/fileReader.js"></script>
    <script src="controllers/navbar.js"></script>
    <script src="controllers/home.js"></script>
    <script src="controllers/signup.js"></script>
    <script src="controllers/login.js"></script>
    <script src="controllers/detail.js"></script>
    <script src="controllers/upload.js"></script>
    <script src="controllers/myUploadsCtrl.js"></script>
    <script src="controllers/userProfileCtrl.js"></script>

    <script src="directives/serverError.js"></script>
    <script src="directives/fileUpload.js"></script>
    <script src="directives/likeHandler.js"></script>
    <script src="directives/showComments.js"></script> -->
    <!-- Directives End -->
    <!-- minified -->
    <script src="app.min.js"></script>
</body>

</html>
