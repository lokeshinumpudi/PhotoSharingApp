var qs = require('querystring');
var comments = require('../models/models.js').comments;
//@descp:get 10 more comments before the given lastCommentTimeof a given postId
//since this is a "GET" request {lastCommentTime,postId} are send as request params in the url 
exports.getMoreComments = function(req, res, next) {
    //req.user :auth user obj
    //req.url: parse the url to get [postId,lastCommentTime]
    var authUser = req.user;
    //auth check
    if (!authUser) {
        //user not authenticated
        res.send({
            error: "No Auth"
        });
        return next();
    };

    //params is anything after the [?][query params generally] in the url
    var params = qs.parse(req.url.split('?')[1]);
    var lastcommenttime = params.lastCommentTime || Date.now();
    //postId check from req.url
    if (!params.postId) {
        res.send({
            error: "error retreiving more comments",
            text: "check the postId in the request filed"
        });
        return;
    };
    //get the comments of a given post id
    comments.find({
            commentOnPhotoId: params.postId,
            commentByUserAt: {
                $lt: lastcommenttime
            }
        })
        .limit(10)
        .sort({
            commentByUserAt: -1
        })
        .exec(function(err, data) {
            if (err) {
                return next(err);
            };
            res.send(data);
        });
}; //exports.getMoreComments

exports.postCommentOnPost = function(req, res, next) {
    //req.user:data of auth user [_id,username,email]
    var authUser = req.user;
    //auth check
    if (!(authUser._id && authUser.username)) {
        //user not authenticated
        res.send({
            error: "No Auth"
        });
        return next();
    };
    //req.body check [comment data sent from the client as post request]
    if (!(req.body.postId || req.body.commentObj)) {
        res.send({
            error: ""
        });
        return;
    };
    //comment was made on this picture with this id
    var postId = req.body.postId;
    //get the posted comment[make analysis(sentiment,other)]
    var commentObj = req.body.commentObj;
    commentObj["commentByUserId"] = authUser._id;
    commentObj["commentOnPhotoId"] = postId;
    commentObj["commentByUserName"] = authUser.username;
    commentObj["commentByUserPicture"] = authUser.picture || " ";
    //now make a new instance model of the comment and save it
    var comment = new comments(commentObj);
    comment.save(function(err, info, isSaved) {
        if (err) {
            return next(err);
        };
        //comment saved 
        res.status(200).send({
            success: "comment saved"
        });
    }); //save
}; //exports.postCommentOnPost
