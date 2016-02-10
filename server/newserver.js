// refactored new base server

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var serveStatic = require('serve-static');
var path = require('path');
//require all the already initialised express,mongoose instances
var config = require('./config/config'),
    expressinit = require('./config/express'),
    mongooseinit = require('./config/mongoose');

//this returns the express instance [which was done in config/express] 
//also all the routes are already passed the app instance right in the config
var app = expressinit();
//this returns the mongoose connection instance[which was done in config/mongoose]
var db = mongooseinit();


//set a express variable to our user uploads field
app.set('userUploadsDir', path.join(__dirname, 'userUploads'));
app.use(serveStatic(__dirname, {
    maxAge: 20
}));
//listen the express app to a port
app.listen(config.port);
//export the express instance again
module.exports = app;
console.log(process.env.NODE_ENV + ' server running at http://localhost:' + config.port);
