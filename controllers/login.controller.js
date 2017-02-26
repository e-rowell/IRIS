const config = require("../config");
const jwt = require('jsonwebtoken');

// Postgres config
const pg = require('pg');

const db = require('../db/db');

module.exports = (passport) => {
    'use strict';

    /*

     Google Login

     */

    // GET /auth/google
    /*
     query params required: lat, long
     */
    const loginGoogle = (req, res) => {
        req.session.user = {};

        if (req.query.location) {

            req.session.user.location = req.query.location;

            return passport.authenticate('google', {
                // scope     : ['https://www.googleapis.com/auth/userinfo.profile'
                //     'https://www.googleapis.com/auth/userinfo.email'],
                scope     : ['profile', 'email'],
                accessType: 'offline', approvalPrompt: 'force'

            })(req, res);
        } else {
            res.status(422).json({ error: 'Missing required parameters.' });
            res.end();
        }
    };


    // GET /auth/google/callback
    const loginGoogleCallback = (req, res) => {
        return passport.authenticate('google', {
            successRedirect: '/auth/google/success',
            failureRedirect: '/auth/google/failure'
        })(req, res);
    };

    // GET /auth/google/success
    const loginGoogleSuccess = (req, res) => {
        return res.json({
            access_token : req.user.access_token,
            refresh_token: req.user.refresh_token
        });
    };

    // GET /auth/google/failure
    const loginGoogleFailure = (req, res) => {
        res.json({ message: 'failed login' })
    };


    /*

     Facebook Login

     */

    // GET /auth/facebook
    const loginFacebook = (req, res) => {
        req.session.user = {};

        if (req.query.lat && req.query.long) {

            req.session.user.lat = req.query.lat;
            req.session.user.long = req.query.long;

            return passport.authenticate('facebook', {
                scope         : ['email'],
                approvalPrompt: 'force'
            })(req, res);
        } else {
            res.status(422).json({ error: 'Missing required parameters.' });
            res.end();
        }
    };

    // GET /auth/facebook/callback
    const loginFacebookCallback = (req, res) => {
        return passport.authenticate('facebook', {
            successRedirect: '/auth/facebook/success',
            failureRedirect: '/auth/facebook/failure'
        })(req, res);
    };

    // GET /auth/facebook/success
    const loginFacebookSuccess = (req, res) => {
        res.json({
            access_token : req.user.access_token,
            refresh_token: req.user.refresh_token
        })
    };

    // GET /auth/facebook/failure
    const loginFacebookFailure = (req, res) => {
        res.json({ message: 'failed login' })
    };


    /*

     Twitter Login

     */

    // GET /auth/twitter
    const loginTwitter = (req, res, next) => {
        req.session.user = {};

        if (req.query.lat && req.query.long) {

            req.session.user.lat = req.query.lat;
            req.session.user.long = req.query.long;

            return passport.authenticate('twitter')(req, res, next);
        } else {
            res.status(422).json({ error: 'Missing required parameters.' });
            res.end();
        }
    };

    // GET /auth/twitter/callback
    const loginTwitterCallback = (req, res, next) => {
        return passport.authenticate('twitter', {
            successRedirect: '/auth/twitter/success',
            failureRedirect: '/auth/twitter/failure'
        })(req, res, next);
    };

    // GET /auth/twitter/success
    const loginTwitterSuccess = (req, res) => {
        res.json({
            access_token : req.user.access_token,
            refresh_token: req.user.refresh_token
        })
    };

    // GET /auth/twitter/failure
    const loginTwitterFailure = (req, res) => {
        res.json({ message: 'failed login' })
    };


// GET /auth/refresh
    const refreshToken = (req, res) => {
        if (req.query.refresh_token) {
            jwt.verify(req.query.refresh_token, config.jwt.secret, (err, decoded) => {
                if (err) {
                    return res.status(422).json({ error: 'Invalid refresh token.' });
                } else {
                    let token = jwt.sign({
                        sub     : decoded.sub,
                        provider: decoded.provider,
                        email   : decoded.email,
                        name    : decoded.name
                    }, config.jwt.secret, {
                        expiresIn: 60 * 20 // 20 minutes
                    });
                    return res.set('X-JWT', token).status(200);
                }
            });
        } else {
            return res.status(422).json({ error: 'No refresh token provided.' });
        }
    };

    const jwtAuth = (req, res, next) => {
        return passport.authenticate('jwt', { session: false })(req, res, next);
    };

// route middleware to make sure the user is logged in
    const isLoggedIn = (req, res, next) => {

        if (req.isAuthenticated()) {
            next();
        }

        res.redirect('/');
    };

    const home = (req, res) => {
        res.json({ "message": "logged in" });
    };

    const logout = (req, res) => {
        req.logout();
        res.redirect('/');
    };


    return {
        loginGoogle          : loginGoogle,
        loginGoogleCallback  : loginGoogleCallback,
        isLoggedIn           : isLoggedIn,
        jwtAuth              : jwtAuth,
        logout               : logout,
        home                 : home,
        loginGoogleSuccess   : loginGoogleSuccess,
        loginGoogleFailure   : loginGoogleFailure,
        loginFacebook        : loginFacebook,
        loginFacebookCallback: loginFacebookCallback,
        loginFacebookSuccess : loginFacebookSuccess,
        loginFacebookFailure : loginFacebookFailure,
        loginTwitter         : loginTwitter,
        loginTwitterCallback : loginTwitterCallback,
        loginTwitterSuccess  : loginTwitterSuccess,
        loginTwitterFailure  : loginTwitterFailure
    }

}
;