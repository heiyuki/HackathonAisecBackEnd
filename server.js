/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////Requiring Modules
/////////////////////////////////////////////////////////////////////////////////////////////////////
var express = require('express');
var bodyparser = require('body-parser');
var jwt = require('jsonwebtoken');
var lusca = require('lusca');
var configManager = require('config');
var expressValidator = require('express-validator');

var app = express();

var secureRouter = express.Router();
var apiRouter = express.Router();

if (!process.env.SECRET_KEY) {
    process.env.SECRET_KEY = "kittykat";
}
console.log(process.env.SECRET_KEY);
/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////Configuring App
/////////////////////////////////////////////////////////////////////////////////////////////////////
var host = configManager.get("host");
//Thx to Wassila hechmi
// x-powered-by Belief !!
app.use((req,res,next)=>{
  res.header("x-powered-by", "Belief");
  next();
});
//Enabling cors
if (process.env.NODE_ENV == "production") {
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', configManager.get("host"));
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

        // intercept OPTIONS method
        if ('OPTIONS' == req.method) {
            res.send(200);
        } else {
            next();
        }
    });
}
var cspParams = {
    policy: {
        "default-src": "'self' " + host,
        "script-src": "'self' https://*.googleapis.com/ http://*.google-analytics.com/ " + host,
        "style-src": "'self' https://*.googleapis.com/ 'unsafe-inline'",
        "img-src": "'self' https://*.googleapis.com/ http://*.google-analytics.com/ https://*.gstatic.com/ data: " + host,
        "font-src": "'self' https://*.gstatic.com/ " + host,
        "connect-src": "'self' https://*.googleapis.com/ " + host,
        "frame-src": "'self' " + host
    }
};
app.use(lusca.csp(cspParams));
app.use(lusca.hsts({
    maxAge: 31536000
}));
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.p3p('ABCDEF'));
app.use(lusca.xssProtection(true));
app.use(lusca.nosniff());
/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////Requiring Local Modules
/////////////////////////////////////////////////////////////////////////////////////////////////////
//Public Routers
var authRouter = require('./routers/public/authentification.router.js');
var usersRouter = require('./routers/public/users.router.js');
//Secure Routers
var profileRouter = require('./routers/secure/profile.router.js');
/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////Configuration MiddleWare
/////////////////////////////////////////////////////////////////////////////////////////////////////

//BodyParser
app.use(bodyparser());


//express-validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));



//secure router middleware
secureRouter.use(function(req, res, next) {
    var token = req.headers['authorization'];
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, function(err, decode) {
            if (err) {
                res.status(500).send({
                    response: "Invalid Token"
                });
            } else {
                next();
            }
        });
    } else {
        res.status(401).send({
            response: "not authorized"
        });
    }
});



/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////Routing
/////////////////////////////////////////////////////////////////////////////////////////////////////
//Public APIs
apiRouter.use('/authentification', authRouter);
apiRouter.use('/users', usersRouter);
//Secure APIs
secureRouter.use('/profile', profileRouter);

//Global routing
app.use('/api', apiRouter);
app.use('/secure', secureRouter);

/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////Listen Port
/////////////////////////////////////////////////////////////////////////////////////////////////////

//app port
app.set('port', (process.env.PORT || 5000));

//app listen
app.listen(app.get('port'), function() {
    console.log('Our app is running on http://localhost:' + app.get('port'));
});
