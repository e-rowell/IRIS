const http = require('http');
const config = require("./config");
const express = require('express');
const passport = require('passport');


const cookieParser = require('cookie-parser');
//const passportFile = require('./config/passport')(passport);

process.env.NODE_ENV = 'development';

// express config
const app = express();
app.set("title", "IRIS");

// body-parser config
const bp = require('body-parser');
app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));
//app.use(cookieParser());

app.use(require('express-session')({
    secret: config['session-secret'],
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// configure routes
const routes = require('./routes')(passport);

// app.use((req, res, next) => {
//     logger.info(new Date(), req.method, req.url);
//     next();
// });

const logger = require("./utils/logger");
app.use(logger);

app.use(routes);

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