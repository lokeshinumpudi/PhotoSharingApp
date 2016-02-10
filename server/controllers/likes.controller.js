var likes = require('../models/models.js').likes;
//used for "POST" requests 
//@descp:saves the like on a postId sent from client
exports.postLikeOnPhoto = function(req, res, next) {
    var authUser = req.user;
    var postId = req.body.postId;
    //auth check
    if (!(authUser || authUser._id || authUser.username)) {
        res.send({
            error: "No auth"
        });
        return next();
    };
    //error from client
    if (!postId) {
        res.send({
            error: "Like on post failed",
            text: "pass a postId on which like needs to be done"
        })
        return next();
    };

    var likeObj = {};
    likeObj["likeOnPhotoId"] = postId;
    likeObj["likeByUserId"] = authUser._id;
    likeObj["likeOnPhotoId"] = postId;
    likeObj["likeByUserName"] = authUser.username;
    likeObj["likeByUserPicture"] = authUser.picture || " ";
    var like = new likes(likeObj);
    like.save(function(err, info, isSaved) {
        if (err) {
            return next(err);
        };
        res.send({
            like_success: true
        });
    }); //like.save
}; //exports.postLikeOnPhoto
