// var mongoose = require('mongoose');
// var config = require('../config/config');
// var models = {};
// //UserSchema
// var UserSchema = new mongoose.Schema({
//     instagramId: {
//         type: String,
//         index: true
//     },
//     email: {
//         type: String,
//         unique: true,
//         lowercase: true
//     },
//     password: {
//         type: String,
//         select: false
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     username: String,
//     fullName: String,
//     picture: {
//         type: String,
//         default: 'http://localhost:3000/userUploads/anonymousUser.jpg'
//     },
//     accessToken: String
// });
// // End of user schema
// // photoSchema
// var photoSchema = new mongoose.Schema({
//     urlMed: String,
//     urlLow: String,
//     urlTbnl: String,
//     originalName: String,
//     imageType: String,
//     postedByUserId: {
//         type: String,
//         index: true
//     },
//     postedByUserAt: {
//         type: Date,
//         default: Date.now
//     },
//     postedByUserName: String,
//     postedByUserPicture: String
// });
// // likesSchema 
// var likesSchema = new mongoose.Schema({
//     likeOnPhotoId: String,
//     likeByUserId: String,
//     likeByUserName: String,
//     likeByUserPicture: String,
//     likeByUserAt: {
//         type: Date,
//         default: Date.now
//     }
// });
// // commentSchema
// var commentsSchema = new mongoose.Schema({
//     commentOnPhotoId: String,
//     commentByUserId: String,
//     commentByUserName: String,
//     commentByUserPicture: String,
//     commentByUserAt: {
//         type: String,
//         default: Date.now
//     },
//     rating: String,
//     comment: String
// });
// //followsSchema
// //defines who a user follows
// var followsSchema = new mongoose.Schema({
//     userId: String,
//     username: String,
//     follows_userId: String,
//     follows_username: String,
//     time: {
//         type: String,
//         default: Date.now
//     }
// });
// //followsSchema
// // defines who follows a user
// var followersSchema = new mongoose.Schema({
//     userId: String,
//     username: String,
//     follower_userId: String,
//     follower_username: String,
//     time: {
//         type: String,
//         default: Date.now
//     }
// });
// //ratingSchema
// var ratingSchema = new mongoose.Schema({
//     ratingOnPhotoId: String,
//     rating: String
// });

// //export the models obj that has user,photo models as its props
// // Example: models{
// //     user:"user model",
// //     photo:"photo model"
// // }
// models.user = mongoose.model('User', UserSchema);
// models.photos = mongoose.model('photo', photoSchema);
// models.likes = mongoose.model("likes", likesSchema);
// models.comments = mongoose.model('comments', commentsSchema);
// models.follows = mongoose.model('follows', followsSchema);
// models.follows = mongoose.model('followers', followsSchema);
// models.ratings = mongoose.model('ratings', ratingSchema);

// module.exports = models;
