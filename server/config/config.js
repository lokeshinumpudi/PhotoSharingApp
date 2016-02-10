// in production the db uses process.env.db exposed by the server running the mongo instance
// module.exports = {
//     db: process.env.db || 'mongodb://127.0.0.1/instagram_app',
//     clientSecret: process.env.clientSecret || '',
//     tokenSecret: process.env.tokenSecret || 'imlokis',
//     sendgridApiKey: ''
// }

//fetches the js file for config depending on the NODE_ENV variable 
module.exports = require('./env/' + process.env.NODE_ENV + '.js');