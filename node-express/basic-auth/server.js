var express = require('express');
var morgan = require('morgan');

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));


//write a function to handel the Auth
function auth (req, res, next) {
    console.log(req.headers);

    //first check is the header have authorization part
    // if no, return 401
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        var err = new Error('You are not authenticated!');
        err.status = 401;
        next(err);
        return;
    }
    //if yes,read the string,to get the username and password
    //the string value is Basic ASDASDASDJSAKDjaksd
    //so, use spilt(' ') to get ASDASDASDJSAKDjaksd
    //ASDASDASDJSAKDjaksd to username:password
    //use spilt(':') to spilt the username and password
    var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];
    if (user == 'admin' && pass == 'password') {
        next(); // authorized
    } else {
        var err = new Error('You are not authenticated!');
        err.status = 401;
        next(err);
    }
}


//apply the function
app.use(auth);

app.use(express.static(__dirname + '/public'));


//after call next,will come to here
app.use(function(err,req,res,next) {

    //if err.status has seat,use it,otherwise 500
    //500 is internal server error
    res.writeHead(err.status || 500, {
        'WWW-Authenticate': 'Basic',
        'Content-Type': 'text/plain'
    });
    // var err = new Error('You are not authenticated!');,show You are not authenticated!
    res.end(err.message);
});

app.listen(port, hostname, function(){
    console.log('Server running at http://'+hostname+':'+port);
});
