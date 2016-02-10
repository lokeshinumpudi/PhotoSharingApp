var request = require('request');
var bcrypt = require('bcrypt-nodejs');
//a function @accepts:user obj with details to generate token for
//@returns the jwt token
var createToken = require('../utilities/utilities.js').createToken;
var isUniqueUsername = require('../utilities/utilities.js').isUniqueUsername;
var isUniqueEmail = require('../utilities/utilities.js').isUniqueEmail;
//oldmodel
// var User = require('../models/models.js').user;

//newmodel
var User = require('../models/newmodels.js').User;
exports.login = function(req, res, next) {
    //req.body:data sent form the client form
    //req.body check
    if (!(req.body.email || req.body.password)) {
        res.send({
            error: "login failed",
            text: "send the email,password fields in the data of request"
        });
        return next();
    };
    //+password is to include the prop in constructing the model 
    //(cause its excluded in the schema)
    User.findOne({
        email: req.body.email
    }, '+password', function(err, user) {
        if (!user) {
            return res.status(401).send({
                message: {
                    email: 'Email not registered'
                }
            });
        };
        //user exists in db
        //now compare the user password with the hash stored in his db
        bcrypt.compare(req.body.password, user.password, function(err, isMatch) {

            if (err) {console.log(err);return;};
            if (!isMatch) {
                return res.status(401).send({
                    message: {
                        password: 'Incorrect password'
                    }
                });
            }; //wrong pass

            //user is immutable cause its directly returned from mongo
            //convert it to a js object to do crud operations
            user = user.toObject();
            //now delete the pasword  field cause we have to send this infmtion to the user as jwt
            delete user.password;
            //now the user is Authenticated so send a jwt to him
            //now encode the user data
            var token = createToken(user);

            res.send({
                token: token,
                user: user
            });
        }); //bcrypt.compare
    }); //User.findOne mongo method
}; //exports.login

exports.signup = function(req, res, next) {
    //req.body:has the body sent from the client
    //req.body check
    if (!(req.body.username || req.body.email || req.body.password)) {
        res.send({
            error: "fieldsMissing",
            text: "username/email/password fields missing in the request body"
        });
        return next();
    };
    //check unique email,username
    isUniqueUsername(req.body.username, function(err, isUnique) {
        //err:either db error [o]r not-unique error
        //isUnique:boolean [true:if unique]
        if (err) {
            if (err.errorType == "notUnique") {
                return res.status(409).send({
                    message: {
                        username: err.username
                    }
                });
                return next();
            };
        }; //if err
        if (isUnique) {
            isUniqueEmail(req.body.email, function(err, isUnique) {
                //err:either db error [o]r not-unique error
                //isUnique:boolean [true:if unique]
                if (err) {
                    if (err.errorType == "notUnique") {
                        return res.status(409).send({
                            message: {
                                email: err.email
                            }
                        });
                        return next();
                    };
                }; //if err
                if (isUnique) {
                    //hmm now all safe to create a new user
                    var user = new User({
                        username: req.body.username,
                        email: req.body.email,
                        password: req.body.password
                    });
                    bcrypt.genSalt(10, function(err, salt) {
                        if (err) {
                            return console.log(err);
                        };
                        //hash the password witht he salt
                        bcrypt.hash(user.password, salt, null, function(err, hash) {
                            //null for progress calback
                            if (err) {
                                return console.log(err);
                            };
                            //save hash as his password
                            user.password = hash;
                            //now save the model to the collection
                            user.save(function(err, user, numberAffected) {
                                if (err) {
                                    return console.log(err);
                                };
                                //now the user is saved generate a token for jwt of the user
                                var token = createToken(user);
                                //send client a jwt for furthut auth activities
                                res.status(200).send({
                                    token: token,
                                    user: user
                                }); //res.send
                            }); //user.save.callback
                        }); //bcrypt.hash
                    }); //bcrypt.genSalt
                }; //isUnique email
            }); //isUniqueEmail check function
        }; //isUnique username
    }); //isUniqueUsername check function

}; //exports.signup

exports.authInstagram = function(req, res, next) {
    //satellizer from the client send us some inf here
    //this is done after the popup is closed
    //like clientId,[our client id]
    //    redirectUri,[used in authorization request]
    //        code,  [received during authorization step][client popup ]
    var accessTokenUrl = 'https://api.instagram.com/oauth/access_token';
    //For a post req to above url instagram need all the below params
    //so we can exchange a access_token for all teh params we send to  instagram 
    var params = {
        client_id: req.body.clientId,
        client_secret: config.clientSecret,
        redirect_uri: req.body.redirectUri,
        code: req.body.code,
        grant_type: 'authorization_code'
    };
    //Step 1:Exchange authorization code for access_token 
    //for that we need to make a
    // [post req] to the above [accessTokenUrl] with
    //the [params] details we have and we get back the [access_token] in return 
    //which we can furthur use to get the user complete activity in the provider
    //[likes,comments,media]
    request.post({
        url: accessTokenUrl,
        form: params,
    }, function(err, response, body) {
        //callback fnc after the post method 
        if (err) {
            console.log(err);
            return;
        };
        body = JSON.parse(body);
        //body is the json instagram sends us about the user
        //Step:2.a link user accounnts
        if (req.headers.authorization) {
            //user is having authenticated  headers
            //user is loggedin [might be from email,password]
            //so we can use the instagram id to check if its linked or not
            // acc with instagram details
            User.findOne({
                instagramId: body.user.id
            }, function(err, existingUser) {
                //if existingUser he has instagram data already merged
                var token = req.headers.authorization.split(' ')[1];
                var payload = jwt.decode(token, config.tokenSecret);
                //now find the user with the payload.sub[it is a user mongo id]
                //[payload.sub is the mongodb _id of the authenticated user]
                User.findById(payload.sub, '+password', function(err, localUser) {
                    if (!localUser) {
                        //user does not exist in db
                        return res.status(400).send({
                            messages: 'User not found'
                        });
                    }; //!localuser[email/password] && !existinguser[instagram]

                    console.log(existingUser, "existingUser");
                    //merge the two accounts
                    if (existingUser) {
                        //instagramdata[existingUser]  
                        //email,password data [localUser]  
                        //give his logged in email,password pref over instagram email
                        console.log("User is linked with instagram[existingUser]");
                        existingUser.email = localUser.email;
                        existingUser.password = localUser.password;
                        //  localUser.remove();

                        existingUser.save(function() {
                            var token = createToken(existingUser);
                            return res.send({
                                token: token,
                                user: existingUser
                            });
                        }); //save
                    } else {
                        //no instagram data in user db 
                        //link current email to Instagram profile
                        console.log("User is not linked with instagram[localUser]");

                        console.log(localUser, "not yet linked with instagram");
                        localUser.instagramId = body.user.id;
                        localUser.username = body.user.username;
                        localUser.fullName = body.user.full_name;
                        localUser.picture = body.user.profile_picture;
                        localUser.accessToken = body.access_token;
                        console.log(localUser, "user linked with insatgaram");
                        //save the user and send the token back
                        localUser.save(function() {
                            var token = createToken(localUser);
                            res.send({
                                token: token,
                                user: localUser
                            });
                        }); //save
                    } //if existing user or not[ie:instagram linked or not]
                }); //User.findById
            }); //User.findOne by insatagramid
        } else {
            //user is not logged in no req.headers.authorization
            //might be [logged out ]or [directly logged in from instagram]
            //Step:2.b create new  user acount or return existing accout
            //check if user already has an account document in db
            User.findOne({
                instagramId: body.user.id
            }, function(err, existingUser) {
                if (existingUser) {
                    var token = createToken(existingUser);
                    res.send({
                        token: token,
                        user: existingUser
                    });
                }; //if user exists already
                //user does not exist
                //so create a new user model instance
                var user = new User({
                    instagramid: body.user.id,
                    username: body.user.username,
                    fullName: body.user.full_name,
                    picture: body.user.profile_picture,
                    accessToken: body.access_token
                }); //create a new User model
                user.save(function() {
                    var token = createToken(user);
                    //send the token,user data to the user
                    //and he can save them in the localStorage and send the token o subsequent req to teh server
                    res.send({
                        token: token,
                        user: user
                    });
                }); //user.save
            }); //User.findOne with instagramid
        } //if/else req.headers.authorization
    }); //request.post to the instagram access_token end point
}; //exports.authInstagram
