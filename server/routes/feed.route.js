//old:route
// var feed = require('../controllers/feed.controller.js');
// var isAuthenticated = require('../utilities/utilities.js').isAuthenticated;
// module.exports = function(app) {
//     //app:instance of express
//     app.get('/', isAuthenticated, feed.getHomeFeed);

//     app.get('/photo/:photoId', isAuthenticated, feed.getPhotoDetails);

//     app.get('/getUserProfile', isAuthenticated, feed.getUserProfile);

// }; //module.exports


var photo = require('../controllers-new/photo.controller.js');

var isAuthenticated = require('../utilities/utilities.js').isAuthenticated;

module.exports = function(app) {
        app.get('/', isAuthenticated, photo.HomeFeed);
        app.get('/getUserProfile', isAuthenticated, photo.userProfile);
    } //module.exports
