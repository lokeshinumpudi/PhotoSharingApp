//Todo: need to refactor this entire mess
//


var bcrypt = require('bcrypt-nodejs'); -
var moment = require('moment');
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var mime = require('mime');
var bodyParser = require('body-parser'); -
var cors = require('cors'); -
var request = require('request');
var express = require('express'); -
var jwt = require('jwt-simple');
var serveStatic = require('serve-static'); -
var compress = require('compression'); -
var uuid = require('node-uuid');
var multer = require('multer');
var imageType = require('image-type');
var config = require('./config.js');

// image compression and resize
var Imagemin = require('imagemin');
var gm = require('gm');
// mongo models

var User = require('./models/models.js').user;
var photos = require('./models/models.js').photos;
var comments = require('./models/models.js').comments;
var likes = require('./models/models.js').likes;
var app = express();

app.set('port', process.env.PORT || 3000);
//this is the direc where user images are stored in hashed format
app.set('userUploads', path.join(__dirname, 'userUploads'));

//Middleware that express uses
//compress module
app.use(compress());
// allow cors from the given origin
app.use(cors({
    origin: 'http://localhost:8000',
    credentials: true,
    methods: 'GET,PUT,POST'
}));
app.use(bodyParser.json({
    limit: '10mb'
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
//static file server for the images
app.use(serveStatic(__dirname, {
    maxAge: 20
}));
//middleware[config]:creates a jwt token for a user obj
var createToken = require('./utilities/utilities.js').createToken;
//middleware[config]:check auth state
var isAuthenticated = require('./utilities/utilities.js').isAuthenticated;
// routes for different endpoints
app.post('/auth/login', function(req, res) {
    //login in  controller user.controller.login
}); //post auth/login
//route email,password signup
app.post('/auth/signup', function(req, res) {
    //signup in controller user.controller.signup
}); //get auth/signup
// signup instagram
app.post('/auth/instagram', function(req, res) {
    //authInstagram in controller user.controller.authInstagram
}); //app.post 'auth/instagram'
//
app.post('/upload', isAuthenticated, function(req, res, next) {
    // body...
}); //app.post

//home feed [all uploaded pics with likes,comments,ratings]
app.get('/', isAuthenticated, function(req, res, next) {}); //app.get home feed

//detail view of a post
app.get('/photo/:photoId', isAuthenticated, function(req, res, next) {
    //this is now in feed.controllers.getPhotoDetailsById
    getPhotoDetails(req.params.photoId, authUser, res);
}); //get '/photo/:photoId'

//get comments on a post
app.get('/getMoreComments', isAuthenticated, function(req, res, next) {
    //in comments.controller.getMoreComments
}); //get 'getMoreComments'

//comment posted by a user on a photo
app.post('/comments', isAuthenticated, function(req, res, next) {
    //in comments.controller.postCommentOnPhoto
}); //post '/comments'  
//liked a post by a user on a photo
app.post('/likes', isAuthenticated, function(req, res, next) {
    //in likes.controller.postLikeOnPhoto
}); //post-"/likes"
// ALL INSTAGRAM INTEGRATIONS
// now we get the user feed of the authenticated user
app.get('/api/feed', isAuthenticated, function(req, res) {
   //in instagram.controller.getInstagramFeed
}); //app.get '/api/feed' route

//get media with a given id
app.get('/api/media/:id', isAuthenticated, function(req, res, next) {
    //in instagram.controller.postLike
}); //app.get '/media/:id'

app.post('/api/like', isAuthenticated, function(req, res, next) {
    //in instagram.controller.postLike
}); //app.post '/api/like'

//listen to the server
app.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});

// new Imagemin()
//     .src('userUploads/*.{gif,jpg,png,svg,jpeg}')
//     .dest('compressed/')
//     .use(Imagemin.jpegtran({progressive: true}))
//     .run(function (err, files) {
//         if (err) {console.log(err)};
//         console.log(files);
//         console.log("gmm done");
//         // => {path: 'build/images/foo.jpg', contents: <Buffer 89 50 4e ...>}
//     });
