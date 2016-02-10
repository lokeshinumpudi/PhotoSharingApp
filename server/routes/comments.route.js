var commentsCtrl = require('../controllers/comments.controller.js');
var isAuthenticated = require('../utilities/utilities.js').isAuthenticated;

module.exports = function(app) {
    //app:instance of express passed from [config/express]
    app.get('/getMoreComments', isAuthenticated, commentsCtrl.getMoreComments);

    app.post('/comments', isAuthenticated, commentsCtrl.postCommentOnPost);

}; //module.exports
