'use strict';

const http = require('http');
const config = require("./config");
const express = require('express');
const passport = require('passport');

const path = require("path"),
    root = path.join(__dirname, "./");


const cookieParser = require('cookie-parser');

process.env.NODE_ENV = 'development';


// express config
const app = express();
app.set("title", "IRIS");


// body-parser config
const bp = require('body-parser');
app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));


const allowedOrigins = ['http://localhost:8083', 'http://iris-app.westus.cloudapp.azure.com'];
const allowCrossDomain = function(req, res, next) {

    let origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With Content-Type, Accept, Authorization");
    next();
};
app.use(allowCrossDomain);


app.use(require('express-session')({
    secret: config['session-secret'],
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);


// allow angular and apidoc files to be served
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'apidoc')));


// configure routes
const routes = require('./routes')(passport);


const logger = require("./utils/logger");
app.use(logger);


app.use(routes);


app.use('/api/api_data.json', (req, res) => {
    res.sendFile('apidoc/api_data.json', { root : root });
});

app.use('/apidoc', (req, res) => {
    res.sendFile('apidoc/index.html', { root: root });
});

app.use('/', (req, res) => {
    res.sendFile('client/index.html', { root: root });
});

app.use(logger.errorLogger);

//app.use(require('morgan')({ "stream": logger.stream }));



// log each request to console
// app.all('*', function logger(req, res, next) {
//     console.log(new Date(), req.method, req.url);
//     next();
// });


const PORT = process.env.PORT || '8083';

const server = app.listen(PORT, () => {
    console.log("Server listening on : http://localhost:%s", PORT);
});

module.exports = { app: app, server: server };