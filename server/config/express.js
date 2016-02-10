//@inits the express app and 
//@passes all the  [routes defined in ./routes/] an instance of the app {var app = express()}
//@scope :is root cause this is require in root server.js
//require all the packages required for basic express init[ like body-parsing,cors,serve-static]

var config = require('./config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    serveStatic = require('serve-static'),
    cors = require('cors'),
    compress = require('compression'),
    path = require('path');

//this returns the express instance when the exported function is called [after requiring]
module.exports = function() {
        var app = express();
        //compress all incoming requests,responses
        app.use(compress());
        // parse incoming  basic forms data
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        //parse incoming json requests
        app.use(bodyParser.json({
                limit: '10mb'
            }))
            //configure the cors 
        app.use(cors({
            origin: config.corsorigin,
            credentials: true,
            methods: 'GET,POST,PUT,DELETE'
        }));
        

        //all the routes defined will be passed the express app instance from here
        //pass all the route the express instance
         require('../routes/auth.route.js')(app);
       require('../routes/upload.route.js')(app);
        require('../routes/feed.route.js')(app);
        // require('../routes/likes.route.js')(app);
        // require('../routes/comments.route.js')(app);

        //return the app instance when this exported instance is called
        return app;
    } //module.exports
