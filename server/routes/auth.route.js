var authCtrl = require('../controllers/auth.controller.js');

module.exports = function(app) {
    //app:is the instance of express


//define all our routes

    app.route('/auth/signup')
        .post(authCtrl.signup);

    app.route('/auth/login')
        .post(authCtrl.login);

    app.route('/auth/instagram')
        .post(authCtrl.authInstagram);
}; //module.exports
