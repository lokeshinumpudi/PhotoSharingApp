// @inits/connects to mongo and @returns the connection instance
//@scope :is root cause this is require in root server.js

var config = require('./config');
//global mongoose package
var mongoose = require('mongoose');

module.exports = function() {
        var db = mongoose.connect(config.db);
        db.connection.on('error', console.error.bind(console, ' Mongo connection error'));
        db.connection.once('open', function() {
            console.log("Mongo connected at " + db.connection.host + ":" + db.connection.port + " dbName:" + db.connection.name);
            //console.log(db.connection)
        });
        //if we require our defined models[here] these will be added to our db instance
        //its best to require them here becasue we export this connection instance to global server
        //and thus all the models are added to the instance right here
        require('../models/models');
        // console.log(db.connection.models);
        return db;
    } //module.exports
