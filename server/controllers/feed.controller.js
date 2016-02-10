//feed controller does crud to all the models

var async = require('async');
var url = require('url');

var User = require('../models/models.js').user;
var photos = require('../models/models.js').photos;
var likes = require('../models/models.js').likes;
var comments = require('../models/models.js').comments;

//@descp:returns an  object of feed for a given photoID
function getPhotoFeedById(photoId, authUser, callback) {
    var feed = {};
    //this is if the current auth user liked the post or not
    var islikedByUser = false;
    async.auto({
            photo: function(cb) {
                photos.findById(photoId, function(err, photo) {
                    if (err) {
                        return cb(err);
                    };
                    cb(null, photo);
                }); //photos.findById
            }, //photo fnc
            postedUser: ['photo', function(cb, result) {
                //result:data sent from rest of all parallel fncs
                var postedByUserId = result.photo.postedByUserId;
                User.findById(postedByUserId, 'username picture _id', function(err, postedUserDetails) {
                    if (err) {
                        return cb(err);
                    };
                    cb(null, postedUserDetails);
                });
            }], //user fnc
            likes: function(cb) {
                //get the likes
                likes.find({
                    likeOnPhotoId: photoId
                }, function(err, likes) {
                    if (err) {
                        return cb(err);
                    };
                    //this is only for auth users
                    //check if the user liked this photo
                    if (authUser) {
                        likes.forEach(function(like) {
                            if (like.likeByUserId == authUser._id) {
                                islikedByUser = true;
                            };
                        }); //likes.forEach
                    }; //if authUser
                    cb(null, likes);
                }); //likes.find
            }, //likes 
            comments: function(cb) {
                    comments.find({
                            commentOnPhotoId: photoId
                        })
                        .sort('-commentByUserAt')
                        .limit(6)
                        .exec(function(err, comments) {
                            if (err) {
                                return cb(err);
                            };
                            //send comments to callback
                            cb(err, comments);
                        }); //comments.find 
                } //comments
        },
        function(err, results) {
            //parallel results
            if (err) {
                return;
            };

            results.islikedByUser = islikedByUser;
            callback(null, results);
        }); //async.auto
} //getPhotoFeedById fnc
//returns the likes,comments,ratings of a given photoId
//this is ctrl for "GET" request
exports.getPhotoDetails = function(req, res, next) {
    //req.user:auth user obj
    //req.params: the params defined in the route [since this is a "GET" req]
    //auth check
    if (!req.user) {
        //user not in auth state
        res.send({
            error: "noAuth",
            redirectHome: true
        });
        return next();
    };
    //params check
    if (!(req.params.photoId)) {
        res.send({
            error: "failed to get photo details",
            text: "some error in the route params"
        });
        return next();
    };
    var authUser = req.user;
    var photoId = req.params.photoId;


    getPhotoFeedById(photoId, authUser, function(err, feed) {
        if (err) {
            return;
        };

        res.status(200).send(JSON.stringify(feed));
    });
}; //exports.getPhotoDetails

//gets likes,comments,retings of some phots and sends as response
exports.getHomeFeed = function(req, res, next) {
    if (req.user) {
        var authUser = req.user;
    };
    //get the homefeed to send to user
    var homeFeed = {};
    photos.find({
            postedByUserAt: {
                $lt: Date.now()
            }
        })
        .limit(4)
        .exec(function(err, photos) {
            //photos:array of the photos found from above query
            if (err) {
                return next(err);
            };
            if (photos.length == 0) {
                res.send("no uploads");
                return next();
            };
            //this is the no of photos were gonna loop over to get each of the photofeed
            var noOfPhotos = photos.length;
            var noOFCallbackCalls = 0;

            photos.forEach(function(photo, index) {
                var photoId = photo._id;
                getPhotoFeedById(photoId, authUser, function(err, photofeed) {
                    //count the no of callbacks that got executed[so that we can -
                    //  confirm that the feeddata of each photo is returned in this one]
                    noOFCallbackCalls = noOFCallbackCalls + 1;
                    if (err) {
                        return;
                    };
                    //add the photofeed to globalfeed
                    homeFeed[photoId] = photofeed;
                    //if its the last callback[ie equal to the no of photos]
                    //send the response to the client
                    if (noOFCallbackCalls == noOfPhotos) {
                        console.log(noOFCallbackCalls);
                        res.status(200).send(JSON.stringify(homeFeed));
                    }; //if 
                }); //getPhotoFeedById fnc call
            }); //photos.forEach




        }); //photos.find [db action]
}; //exports.getHomeFeed

function getUserById(userId, callback) {
    if (!userId) {
        return;
    };
    User.findById(userId, '-email', function(err, user) {
        if (err) {
            callback(err);
            return;
        };
        callback(null, user);
    });
};

//fetches the users recent 10 photos uploads
function getUserRecent10Photos(userId, time, cb) {
    //time:time before which photofeeds should be fetched
    userId = userId || "123456789";
    time = time || Date.now();
    photos.find({
            postedByUserId: userId,
            postedByUserAt: {
                $lt: time
            }
        })
        .sort({postedByUserAt:-1})
        .limit(10)
        .exec(function(err, feed) {
            if (err) {
                return cb(err);
            };
            cb(null, feed);
        }); //photos.find
}; //getUserRecentPhotoFeeds

exports.getUserProfile = function(req, res, next) {
    //req.user:req from auth user
    //parse the req.url

    var urlparams = url.parse(req.url);
    var userId = urlparams.query.split("=")[1];
    async.parallel({
        user: function(callback) {
            getUserById(userId, function(err, user) {
                if (err) {
                    callback(err);
                    return;
                };
                callback(null, user);
            }); //getUSerByID
        },
        photos: function(callback) {
            getUserRecent10Photos(userId, Date.now(), function(err, feeds) {
                if (err) {
                    return callback(err);
                };
                callback(null, feeds);
            }); //getUserRecent10Photos fnc call
        },
        likes: function(callback) {
            callback(null, "test");
        }
    }, function(err, result) {
        if (err) {
            console.log(err);
            return;
        };

        res.send(JSON.stringify(result));
    }); //async.parallel

}; //exports.getUserProfile
