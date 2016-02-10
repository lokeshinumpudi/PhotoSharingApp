var fs = require('fs');
var multer = require('multer');
var uuid = require('node-uuid');
// photos model
var photos = require('../models/models.js').photos;
var generateDiffResImages = require('../utilities/utilities.js').generateDiffResImages;
//var clientendpoint = "http://griet-photoexpo.herokuapp.com";
var clientendpoint = "http://localhost:8000";
var serverendpoint = "http://localhost:3000";
//multer filter function to reject video uploads
function uploadFileFilter(req, file, cb) {
    //if its a video file just reject 
    var mimeformat = file.mimetype.split("/")[0];
    if (mimeformat == "video") {
        //stop processing furthur in multer
        return cb(null, false);
    };
    //pass furthur procesing of uloaded data in multer 
    cb(null, true);
}
//multer init config
//@descp:upload is the function returned from multer methods
//it accepts only single file uploads
var upload = multer({
    dest: '../../userUploads/',
    fileFilter: uploadFileFilter,
    limits: {
        fileSize: 10465760
    }
}).single('photo');
//saves the user uploaded post to the fileSystem and saves data to the mongo
exports.postUpload = function(req, res, next) {
        //@descp:upload is the multer method configured to accept the file uploads
        upload(req, res, function(err) {
            if (err) {
                console.log(err);
                return next();
            };
            //multer parsed data correctly
            var postedGuyId = req.body.user.postedBy;
            var file = req.file;
            //generate a hash name to the image
            if (!file) {
                res.redirect(clientendpoint + '/#/upload');
                return;
            };
            var imageHash = uuid.v1();
            //add file type to the hash[.png,.jpeg,.gif] 
            var imageExtn = file.mimetype.split('/')[1];
            var imageHashName = imageHash + '.' + imageExtn;
            var fromPath = file.path;
            var toPath = 'userUploads/' + imageHashName;
            //generate mediumres,lowres,thumbnails of the user image
            var imageobj = {
                "path": fromPath,
                "mime": imageExtn,
                "hash": imageHash
            }
            if (fromPath && imageExtn && imageHash) {
                //end user connection
                res.redirect(clientendpoint + '/#/upload');
                res.end();

                generateDiffResImages(imageobj, function(err, diffResObj) {
                    //diffResObj:object of names of the different resolution images
                    if (err) {
                        console.log(err);
                        return;
                    };
                    console.log(diffResObj);
                    //save the meta to the mongo
                    var serveUrl = serverendpoint + "/";
                    var photo = new photos({
                        postedByUserId: postedGuyId,
                        imageType: file.mimetype,
                        urlMed: serveUrl + diffResObj.mediumPath,
                        urlLow: serveUrl + diffResObj.lowPath,
                        urlTbnl: serveUrl + diffResObj.tbnlPath,
                        originalName: file.originalname

                    });
                    photo.save(function(err, info, isSavedbool) {
                        if (err) {
                            return next(err)
                        };
                        console.log("photo meta saved in mongo")
                    });
                }); //generateDiffResImages
            }; //if toPath&&imageExtn check
            //end of upload multer fnc
        }); //upload handling fnc
    } //exports.postUpload
