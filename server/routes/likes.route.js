var likesCtrl = require('../controllers/likes.controller.js');

var isAuthenticated = require('../utilities/utilities.js').isAuthenticated;


module.exports = function  (app) {
		//app:instance of express

		app.post('/likes',isAuthenticated,likesCtrl.postLikeOnPhoto);
};//module.exports