var moment = require('moment');
var async = require('async');
var gm = require('gm');
var jwt = require('jwt-simple');
var config = require('../config/config.js');
//db:models

//var User = require('../models/models.js').user;
var User = require('../models/newmodels.js').User;
/*@params:'imageObj':the config  of the image which has to be processed
      1:'imageobj.hash'=> the hashed[stored name in filesystem but
       [without file extn] name of the image
      2:'imageobj.path' : path where the image is stored in fs
      3:'imageobj.mime':  mime typ of the image
@description: generates different resolutions of the given image
@returns: a callback with an object of  'name'=> "path" value
ex: {
    'low': "test/diffRes/low.png",
    'high': 'test/diffRes/high.png'
}
*/
exports.generateDiffResImages = function(imageObj, maincb) {
    //imageObj :has hash,path,mime of the image
    var resObj = {};

    if (!(imageObj.hash || imageObj.path || imageObj.mime)) {
        return callback(" Error: hash/path/mime missing ");
    };

    var mediumPath = "userUploads/" + imageObj.hash + "-med." + imageObj.mime;
    var lowPath = "userUploads/" + imageObj.hash + "-low." + imageObj.mime;
    var thumbnailPath = "userUploads/" + imageObj.hash + "-tbnl." + imageObj.mime;

    async.parallel({
        mediumPath: function(callback) {
            gm(imageObj.path)
                .resize(640, 640)
                .write(mediumPath, function(err) {
                    if (err) {
                        return callback(err);
                    };
                    callback(null, mediumPath);
                }); //write -medium 
            //end of mediumPath  parallel fnc
        },
        lowPath: function(callback) {
            gm(imageObj.path)
                .resize(320, 320)
                .write(lowPath, function(err) {
                    if (err) {
                        return callback(err);
                    };
                    callback(null, lowPath);
                }); //write -low 

            //end of lowPath  parallel fnc
        },
        tbnlPath: function(callback) {
            gm(imageObj.path)
                .resize(150, 150)
                .write(thumbnailPath, function(err) {
                    if (err) {
                        return callback(err);
                    };
                    callback(null, thumbnailPath);
                }); //write thumbnail 

            //end of tbnlPath parallel fnc
        }
    }, function(err, result) {
        //called after all the parallel fncs are done 
        if (err) {
            return maincb(err)
        };
        //call callback with the result
        maincb(null, result);
    });
}; //utilities.generateDiffResImages fnc
//@used :used for checking user[his request] auth state when receiving http request from the browser
//@description: #adds a (user=>{}) obj to the {req.user} [if a request from user has auth headers]
// adds nothing if user[his request] is not authenticated[no auth headers] 

exports.decodeToken = function(token) {
    //decode the received token with our secret
    var payload = jwt.decode(token, config.tokenSecret);
    var now = moment().unix();

    //now check if the payload has expired or not 
    if (now > payload.exp) {
        return  null;
    };
    return payload;
}; //exports.decodeToken
exports.isAuthenticated = function(req, res, next) {
    if (!(req.headers && req.headers.authorization)) {
        //user not authenticated
        return next();
    };
    var header = req.headers.authorization.split(' ');
    var token = header[1];
    //decode the received token with our secret
    var payload = jwt.decode(token, config.tokenSecret);
    var now = moment().unix();

    //now check if the payload has expired or not 
    if (now > payload.exp) {
        res.status(401).send({
            message: 'Token has expired'
        });
    };
    //now go find the user db from the user id
    User.findById(payload.sub, function(err, user) {
        if (!user) {
            return res.status(400).send({
                message: 'User no longer exists'
            });
        };
        //we found the user so add him to the req.user ||used by furthur middleware
        req.user = user;
        next();
    }); //findById
}; //utilities.isAuthenticated

//@description:genereate a jwt token for a given [user=>{}] object with exp,iat,sub props
//@requires:user object should have  a {_id}:[its the mongo document {_id} of the user] property 
//@returns: returns the jwt encoded token 
exports.createToken = function(user) {
    if (!user._id) {
        return "_id:is required to create a token for an object";
    };
    var payload = {
        exp: moment().add(14, 'days').unix(),
        iat: Date.now(),
        sub: user._id
    }; //payload
    //encode the payload with a secret[in config]
    var token = jwt.encode(payload, config.tokenSecret);
    return token;
}; //utilities.createToken

//calls callback with[email] if unique email
exports.isUniqueEmail = function(email, callback) {
    //check if a user with the given email exists or not
    User.findOne({
        email: email
    }, 'email', function(err, user) {
        if (err) {
            callback(err);
            return;
        };
        //OHH Sorry:user exists with given email registered []
        if (user) {
            return callback({
                errorType: 'notUnique',
                email: 'Email already registered'
            });
        };
        //call the callback
        callback(null, true);
    });
}; //utilities.isUniqueEmail

//calls callback with[username] if unique username
exports.isUniqueUsername = function(username, callback) {
    //check if a user with the given email exists or not
    console.log(username);
    if (!username) {return;};
    User.findOne({
        username: username
    }, 'username', function(err, user) {
        if (err) {
            callback(err);
            return;
        };
        //OHH Sorry:user exists with given username registered []
        if (user) {
            return callback({
                errorType: 'notUnique',
                username: 'Username already registered'
            });
        };
        //call the callback with the
        callback(null, true);
    });
}; //utilities.isUniqueEmail
