const express = require('express');
const router = express.Router();

module.exports = (passport) => {
    'use strict';

    const userCtrl = require('./controllers/user.controller')(passport);
    const loginCtrl = require('./controllers/login.controller')(passport);
    const incidentCtrl = require('./controllers/incident.controller')(passport);

    router.route('/api/users').post(userCtrl.createUser);
    router.route('/api/users/id:').get(userCtrl.getUser);

    router.route('/auth/google').get(loginCtrl.loginGoogle);
    router.route('/auth/google/callback').get(loginCtrl.loginGoogleCallback);
    router.route('/auth/google/success').get(loginCtrl.loginGoogleSuccess);
    router.route('/auth/google/failure').get(loginCtrl.loginGoogleFailure);

    router.route('/auth/facebook').get(loginCtrl.loginFacebook);
    router.route('/auth/facebook/callback').get(loginCtrl.loginFacebookCallback);
    router.route('/auth/facebook/success').get(loginCtrl.loginFacebookSuccess);
    router.route('/auth/facebook/failure').get(loginCtrl.loginFacebookFailure);

    router.route('/auth/twitter').get(loginCtrl.loginTwitter);
    router.route('/auth/twitter/callback').get(loginCtrl.loginTwitterCallback);
    router.route('/auth/twitter/success').get(loginCtrl.loginTwitterSuccess);
    router.route('/auth/twitter/failure').get(loginCtrl.loginTwitterFailure);


    router.route('/api/incidents').post(incidentCtrl.createIncident);
    router.route('/api/incidents').get(incidentCtrl.getAllIncidents);
    router.route('/api/incidents/:id').get(incidentCtrl.getIncident);
    router.route('/api/users/:id/incidents').get(incidentCtrl.getUserIncidents);



    router.route('/logout').get(loginCtrl.logout);
    router.route('/home').get(loginCtrl.isLoggedIn, loginCtrl.home);

    router.route('/').get((req, res) => {
       return res.json({"message": "hello"});
    });

    return router;
};