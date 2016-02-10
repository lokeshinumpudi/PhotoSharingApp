var request = require('request');
var params = {
    client_id: "7f4551c0b41a41b49325d7def4680785",
    client_secret: "b938174c34d1469e9d76a60a1ae73086",
    redirect_uri: "http://localhost:8000/client",
    code: "6a3229245db24cabaefcb97b0023440b",
    grant_type: 'authorization_code'
};
request.post({
    url: 'http://api.instagram.com/oauth/access_token',
    form: params,
}, function(err, response, body) {
	if (err) {console.log(err)};
    console.log(response.body);
    console.log(response)
});

