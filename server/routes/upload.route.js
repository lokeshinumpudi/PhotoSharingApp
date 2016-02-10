// var photoCtrl = require('../controllers/photo.controller.js');
var newphotoCtrl = require('../controllers-new/photo.controller.js');
var isAuthenticated = require('../utilities/utilities.js').isAuthenticated;
module.exports = function  (app) {
		//app:instance of the express 
		app.post('/upload',newphotoCtrl.postUpload);

};//module.exports