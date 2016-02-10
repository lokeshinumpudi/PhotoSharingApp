var fs = require('fs');
var url = require('url');
var async = require('async');
var multer = require('multer');
var uuid = require('node-uuid');
// db models
var User = require('../models/newmodels.js').User;
var photos = require('../models/newmodels.js').Photo;
//utilities
var generateDiffResImages = require('../utilities/utilities.js').generateDiffResImages;
var decodeToken = require('../utilities/utilities.js').decodeToken;

var clientendpoint = "http://localhost:8000";
var serverendpoint = "http://localhost:3000/";

//multer filter function to reject video uploads
function uploadFileFilter(req, file, cb) {
    //if its a video file just reject 
    var mimeformat = file.mimetype.split("/")[0];
    if (mimeformat == "video") {
        //stop processing furthur in multer
        return cb(null, false);
    };
    //pass furthur procesing of uloaded data in multer 
    cb(null, true);
}
//multer init config
//@descp:upload is the function returned from multer methods
//it accepts only single file uploads
var upload = multer({
    dest: '../../userUploads/',
    fileFilter: uploadFileFilter,
    limits: {
        fileSize: 10465760
    }
}).single('photo');
exports.postUpload = function (req, res, next) {
    upload(req, res, function (err) {
        //req.file:contains the uploaded file information
        //req.body:contains the other uploaded fields
        //err check
        if (err) {
            res.send({
                error: "upload failed"
            });
            return next();
        };
        //mongos id of a user[from jwt]
        var user_id = decodeToken(req.body.token).sub;
        var file = req.file;
        //get the tags[array of tags]
        var tags = req.body.description.match(/#(\w)*/g);
        var imageHash = uuid.v1();
        //add file type to the hash[.png,.jpeg,.gif] 
        var imageExtn = file.mimetype.split('/')[1];
        var imageHashName = imageHash + '.' + imageExtn;
        var toPath = 'userUploads/' + imageHashName;
        //generate mediumres,lowres,thumbnails of the user image
        var imageobj = {
            "path": file.path,
            "mime": imageExtn,
            "hash": imageHash
        }
        
        //start sequence of image handling[resize,store in db]
        async.auto({
            images: function (cb) {
                generateDiffResImages(imageobj, function (err, diffResObj) {
                    if (err) {
                        return cb(err);
                    };
                    cb(null, {
                        tbnl_res: serverendpoint + diffResObj.tbnlPath,
                        low_res: serverendpoint + diffResObj.lowPath,
                        med_res: serverendpoint + diffResObj.mediumPath
                    });
                }); //generateDiffImages
            },
            savedIns: function (cb) {
                User.findById(user_id, '-password', function (err, user) {
                    if (err) {
                        return console.log(err);
                    };
                    //create photos model
                    var newphoto = new photos({
                        postedBy: user._id, //ref for populate
                        createdAt: Date.now(),
                        originalname: file.originalname,
                        description: req.body.description
                    });
                    //add tags to subdoc
                    if (tags) {
                        tags.forEach(function (tag) {
                            tag = tag.slice(1);
                            newphoto.tags.push({
                                tag: tag
                            });
                        }); //forEach tags
                    }; //if tags

                    //save the photo model
                    newphoto.save(function (err, savedPhotoIns, isSaved) {
                        if (err) {
                            return next({
                                error: "failed during photos model save"
                            });
                        }; //iferr

                        //save the post in the user.posts obj
                        user.posts.push(newphoto);
                        //save the user model
                        user.save(function (err, savedUserIns, isSaved) {
                            if (err) {
                                return next({
                                    error: "failed when saving to user model"
                                });
                            }; //id err
                            //end the client conn
                            console.log(savedUserIns);
                            cb(null, {
                                user: savedUserIns,
                                photo: savedPhotoIns
                            });
                        }); //user.save

                        //send the response to the user
                        res.redirect(clientendpoint + "#/");
                        res.send({
                            success: true
                        });


                    }); //newphoto.save
                }); //User.findById
            }
        }, function (err, result) {
            if (err) {
                return next();
            };
            //result.images[lowPath,medPath,tbnlPath]
            //result.savedIns.user:>user saved document instance
            //result.savedIns.photo:>photo saved document
            var photo_ins = result.savedIns["photo"];
            var obj = {
                tbnl_res: result.images.tbnl_res,
                low_res: result.images.low_res,
                med_res: result.images.med_res
            }
            //update the photos doc with image urls
            photos.update({
                _id: photo_ins._id
            }, {
                    $set: {
                        images: obj
                    }
                }, function (err, info) {
                    if (err) {
                        console.log(err);
                    };
                }); //photos.update
        }); //async.auto

    }); //multer upload method
}; //exports.postUpload


exports.HomeFeed = function (req, res, next) {
    //req.user:if user is auth
    var user_id = req.user._id;
    photos.find({})
        .populate('postedBy')
        .exec(function (err, photos) {
            if (err) {
                return console.log(err);
            };
            res.send(JSON.stringify(photos));
        }); //exec
}; //exports.HomeFeed


exports.userProfile = function (req, res, next) {
    //req.user
    if (!req.user.username) {
        return;
    };

    var params = url.parse(req.url);
    var username = params.query.split("=")[1];


    User.find({
        username: username
    }, '-password -email')
        .populate('posts')
        .exec(function (err, userfeed) {
            if (err) {
                return console.log(err);
            };

            res.send(JSON.stringify(userfeed));
        }); //User.find.exec

}; //exports.userProfile
