const GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

const passportJwt = require('passport-jwt');
const extractJwt = passportJwt.ExtractJwt;
const JwtStrategy = passportJwt.Strategy;

const config = require('../config');
const https = require('https');
const db = require('../db/db');
const jwt = require('jsonwebtoken');


module.exports = (passport) => {
    'use strict';

    //let user = {};


    passport.serializeUser((user, done) => {

        console.log('serialize user');
        console.log(user);
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        console.log('deserialize user');

        jwt.verify(user.access_token, config.jwt.secret, (err, decoded) => {
            if (err) {
                console.log(err);
            }

            if (decoded) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    });


    passport.use(new JwtStrategy({
        secretOrKey   : config.jwt.secret,
        jwtFromRequest: extractJwt.fromAuthHeaderWithScheme(config.jwt.authScheme),
        authScheme    : config.jwt.authScheme,
        issuer        : config.jwt.issuer,
        audience      : config.jwt.audience
    }, (payload, done) => {

        return done(null, payload);

        // find user information
        // let user = {};
        // if (user) {
        //     return done(null, user);
        // } else {
        //     return done(null, false);
        // }
    }));


    passport.use(new GoogleStrategy({
        clientID         : config.oauth.google.client_id,
        clientSecret     : config.oauth.google.client_secret,
        callbackURL      : config.oauth.google.callback_url,
        passReqToCallback: true
    }, verifyCallback));


    passport.use(new FacebookStrategy({
        clientID         : config.oauth.facebook.client_id,
        clientSecret     : config.oauth.facebook.client_secret,
        callbackURL      : config.oauth.facebook.callback_url,
        profileFields    : ['displayName', 'email'],
        passReqToCallback: true
    }, verifyCallback));


    passport.use(new TwitterStrategy({
        consumerKey: 'v7COLKOEyUzLwBn00MWovdJwh',
        consumerSecret: 'cH5RVrSYkYx40fKFkJdHNFOLr3UHQLX76ZhzOxI5XMZ4wIc8Z0',
        callbackURL: 'http://127.0.0.1:8082/auth/twitter/callback',
        // consumerKey   : config.oauth.twitter.consumer_key,
        // consumerSecret: config.oauth.twitter.consumer_key,
        // callbackURL   : config.oauth.twitter.callback_url,
        passReqToCallback: true,
        userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
    }, verifyCallback));


    function verifyCallback(req, access_token, refresh_token, profile, done) {
        process.nextTick(() => {
            // verify token

            db.user.getUserByEmail(profile.emails[0].value, (err, result) => {
                if (err) {
                    throw err;
                }
                if (result.rows.length > 0) {

                    let tokens = generateTokens(profile.provider, result.rows[0].user_id,
                        profile.displayName, profile.emails[0].value);

                    return done(null, tokens);
                } else {

                    db.user.createUser(profile.provider, profile.emails[0].value,
                        req.session.user.location, (err, result) => {
                            if (err) {
                                if (err.code == "23505") { // duplicate entry

                                }
                                done(null, false);
                            } else {
                                let tokens = generateTokens(profile.provider, result.rows[0].user_id,
                                    profile.displayName, profile.emails[0].value);
                                return done(null, tokens);
                            }
                        });
                }
            });
        })
    }


    function generateTokens(provider, userId, name, email) {
        let access_token = jwt.sign({
            sub     : userId,
            provider: provider,
            email   : email,
            name    : name
        }, config.jwt.secret, {
            expiresIn: 60 * 20 * 100 * 100 // 20 minutes
        });

        let refresh_token = jwt.sign({
            sub     : userId,
            provider: provider,
            email   : email,
            name    : name
        }, config.jwt.secret, {
            expiresIn: '168h' // 1 week
        });
        return { access_token, refresh_token };
    }

};


