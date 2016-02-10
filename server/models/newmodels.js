var mongoose = require('mongoose');
var config = require('../config/config');

var exportmodels = {};
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: String,
    password: {
        type: String,
        select: false
    },
    username: String,
    full_name: String,
    picture: {
        type: String,
        default: 'http://localhost:3000/userUploads/anonymousUser.jpg'
    },
    createdAt: {
        type: String,
        default: Date.now()
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Photo' //ref the Photo model for populate
    }],
    follows: [{
        type: Schema.Types.ObjectId,
        ref: 'User' //ref the User model for populate
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User' //ref the User model for populate
    }]
}); //userSchema

var photoSchema = new Schema({
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User' //ref the User model for populate
    },
    createdAt: {
        type: String,
        default: Date.now()
    },
    description: String,
    originalname: String,
    images: {
        tbnl_res: String,
        low_res: String,
        med_res: String,
        high_res: String
    },
    tags: [{
        tag: String
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User' //ref the User model for populate
    }],
    comments: [{
        text: String,
        commentByUserId: String,
        commentByUserName: String,
        commentByUserPicture: String,
        commentByUserAt: {
            type: String,
            default: Date.now()
        }
    }],
    meta: {
        likes_count: Number,
        comments_count: Number
    }
});
//photoSchema

//add models to the models obj that will be exported
exportmodels.User = mongoose.model('User', userSchema);
exportmodels.Photo = mongoose.model('Photo', photoSchema);

module.exports = exportmodels;
