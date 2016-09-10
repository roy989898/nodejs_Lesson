var express = require('express');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));


//because of we need to use signed cookie,we sett he key
app.use(cookieParser('12345-67890-09876-54321')); // secret key

function auth(req, res, next) {


    //check is there has a signedCookies
    if (!req.signedCookies.user) {
        var authHeader = req.headers.authorization;
        // if no signed cookies,check is there has a authHeader
        if (!authHeader) {
            //if all not have,response 401
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
            return;
        }
        //if no signed cookies but have auth Header,get information from the authHeader
        var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
        var user = auth[0];
        var pass = auth[1];
        if (user == 'admin' && pass == 'password') {
            //give back the cookie to the user,next time the req will have this cookie
            res.cookie('user', 'admin', {signed: true});
            next(); // authorized
        } else {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    }
    else {
        //if have cookies and user is admin
        if (req.signedCookies.user === 'admin') {
            next();
        }
        else {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    }
};

app.use(auth);

app.use(express.static(__dirname + '/public'));

app.use(function (err, req, res, next) {

    res.writeHead(err.status || 500, {
        'WWW-Authenticate': 'Basic',
        'Content-Type': 'text/plain'
    });
    res.end(err.message);
});

app.listen(port, hostname, function () {
    console.log('Server running at http://' + hostname + ':' + port);
});