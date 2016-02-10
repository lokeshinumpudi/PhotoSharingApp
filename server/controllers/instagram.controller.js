var request = require('request');

//get the auth users instagram[if instagram linked] feed and send it as response
exports.getInstagramFeed = function(req, res, next) {
	//req.user:auth users obj
    var feedUri = 'https://api.instagram.com/v1/users/self/feed';
    //below params are defined by the instagram endpoint
    var params = {
        access_token: req.user.accessToken,
        count: 10
    };
    //now make a get req to the feedUri
    request.get({
        url: feedUri,
        qs: params
    }, function(error, response, body) {
        if (error) {
            console.log(error, "request error")
        };
        if (!error && response.statusCode === 200) {
            //no error & good response
            //send the feed to the user
            res.send(body);
        };
    }); //request.get to feeduri
}; //exports.getInstagramFeed

//makes a post request to the instagramLikeEndpoint
exports.postLike = function(req, res, next) {
    //req.user:auth user obj
    //req.body:data sent from clients
    //mediaId is sent from the client in post request
    var mediaId = req.body.mediaId;
    var formObj = {
        access_token: req.user.accessToken
    };
    var instagramLikeEndpoint = 'https://api.instagram.com/v1/media/' + mediaId + '/likes';
    request.post({
        url: instagramLikeEndpoint,
        form: formObj,
        json: true
    }, function(error, response, body) {
        //post success but not valid [cause statusCode not 200]
        if (response.statusCode !== 200) {
            return res.status(response.statusCode).send({
                code: response.statusCode,
                message: body.meta.error_message
            });
        }
        res.status(200).end();
    }); //request.post to instagramLikeEndpoint endpoint
}; //exports.postLike

exports.getMediaById = function(req, res, next) {
    //req.user: obj of auth user[if auth] 
    var mediaUrl = 'https://api.instagram.com/v1/media/' + req.params.id;
    var params = {
        access_token: req.user.accessToken
    };
    //now make a request to the mediaurl endpoint with accesstoken as qs:param to access
    //a user media
    request.get({
        url: mediaUrl,
        qs: params,
        json: true
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            //send the response data to the client
            res.send(body.data);
        } //no error and good response
    }); //request.get to the mediaurl endpoint
}; //exports.getMediaById
