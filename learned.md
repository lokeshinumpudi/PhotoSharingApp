##instagram 

#authorizationEndPoint
https://api.instagram.com/oauth/authorize


##cors

var cors = require('cors');


//this alows cors from only localhost:8000
app.use(cors({origin:'http://localhost:8000',credentials:true}));

#props
   - origin : configures   **Access-Control-Allow-Origin**   { [accepts a string ie: [url] ]}
-credentials: configures   **Access-Control-Allow-Credentials**
-methods    :configures    **Access-Control-Allow-Methods**   { ['POST','GET','PUT'] array of methods}
-maxAge    :configures   ** Access-Control-Allow-Max-Age** {set to integer to pass the header or  omitted}
