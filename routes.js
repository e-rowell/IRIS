const express = require('express');
const router = express.Router();

module.exports = (passport) => {
    'use strict';

    const userCtrl = require('./controllers/user.controller')(passport);
    const loginCtrl = require('./controllers/login.controller')(passport);
    const incidentCtrl = require('./controllers/incident.controller')(passport);
    const reportCtrl = require('./controllers/report.controller')(passport);
    const categoryCtrl = require('./controllers/category.controller')(passport);
    const dataCtrl = require('./controllers/data.controller')();

    /**
     * @api {POST} /api/users Create User
     * @apiName PostUser
     * @apiGroup User
     *
     * @apiParam {String} provider The provider string for the social account (ex. Google, Facebook, Twitter).
     * @apiParam {String} email The user's email address
     * @apiParam {String} location The user's default location (long / lat: 42.12345, -122.12312)
     *
     * @apiSuccessExample {JSON} UserRecord-Created
     *              HTTP/1.1 201 Created
     *              {
     *                  "location": "/api/user/123"
     *              }
     * @apiErrorExample {JSON} MissingParameters
     *
     *              HTTP/1.1 400 Bad Request
     *              {
     *                  "error": "Missing parameters."
     *              }
     * @apiVersion 0.1.0
     */
    router.route('/api/users').post(userCtrl.createUser);


    /**
     * @api {GET} /api/users/:id Get User Information
     * @apiName GetUser
     * @apiGroup User
     *
     * @apiParam {Number} user_id The user's unique ID.
     *
     * @apiSuccess {String} The URI location of the new user.
     * @apiSuccessExample {JSON} Get-User-Record:
     *              HTTP/1.1 200 Success
     *              {
     *                  "user_id": "123",
     *                  "email": "johnsmith@gmail.com",
     *                  "default_location": "42.12345, -122.12312",
     *                  "credibility": "9.87",
     *                  "created": "2017-02-03",
     *              }
     * @apiErrorExample {JSON} MissingParameters
     *
     *              HTTP/1.1 422 Bad Request
     *              {
     *                  "error": "Missing parameters."
     *              }
     * @apiVersion 0.1.0
     */
    router.route('/api/users/:id').get(userCtrl.getUserById);


    /**
     * @api {GET} /auth/google Login With Google
     * @apiName LoginGoogle
     * @apiGroup Login
     *
     * @apiParam {String} location (query) The user's default location.
     *
     * @apiSampleRequest /auth/google?location=42.123123,-123.123123
     *
     * @apiSuccessExample {JSON} Login-Google-Success:
     *              HTTP/1.1 200 Success
     *              {
     *                  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsInByb3...",
     *                  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsInByb3..."
     *              }
     * @apiErrorExample {JSON} Missing-Parameters:
     *
     *              HTTP/1.1 422 Bad Request
     *              {
     *                  "error": "Missing required parameters."
     *              }
     * @apiVersion 0.1.0
     */
    router.route('/auth/google').get(loginCtrl.loginGoogle);

    /** Internal route for OAuth login flow. */
    router.route('/auth/google/callback').get(loginCtrl.loginGoogleCallback);

    /** Internal route for OAuth login flow. */
    router.route('/auth/google/success').get(loginCtrl.loginGoogleSuccess);

    /** Internal route for OAuth login flow. */
    router.route('/auth/google/failure').get(loginCtrl.loginGoogleFailure);

    /**
     * @api {GET} /auth/facebook Login With Facebook
     * @apiName LoginFacebook
     * @apiGroup Login
     *
     * @apiParam {String} location (query) The user's default location.
     *
     * @apiSampleRequest /auth/facebook?location=42.123123,-123.123123
     *
     * @apiSuccessExample {JSON} Login-Facebook-Success:
     *              HTTP/1.1 200 Success
     *              {
     *                  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsInByb3...",
     *                  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsInByb3..."
     *              }
     * @apiErrorExample {JSON} Missing-Parameters:
     *
     *              HTTP/1.1 422 Bad Request
     *              {
     *                  "error": "Missing required parameters."
     *              }
     * @apiVersion 0.1.0
     */
    router.route('/auth/facebook').get(loginCtrl.loginFacebook);

    /** Internal route for OAuth login flow. */
    router.route('/auth/facebook/callback').get(loginCtrl.loginFacebookCallback);

    /** Internal route for OAuth login flow. */
    router.route('/auth/facebook/success').get(loginCtrl.loginFacebookSuccess);

    /** Internal route for OAuth login flow. */
    router.route('/auth/facebook/failure').get(loginCtrl.loginFacebookFailure);

    /**
     * @api {GET} /auth/twitter Login With Twitter
     * @apiName LoginTwitter
     * @apiGroup Login
     *
     * @apiParam {String} location (query) The user's default location.
     *
     * @apiSampleRequest /auth/twitter?location=42.123123,-123.123123
     *
     * @apiSuccessExample {JSON} Login-Twitter-Success:
     *              HTTP/1.1 200 Success
     *              {
     *                  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsInByb3...",
     *                  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsInByb3..."
     *              }
     * @apiErrorExample {JSON} Missing-Parameters:
     *
     *              HTTP/1.1 422 Bad Request
     *              {
     *                  "error": "Missing required parameters."
     *              }
     * @apiVersion 0.1.0
     */
    router.route('/auth/twitter').get(loginCtrl.loginTwitter);

    /** Internal route for OAuth login flow. */
    router.route('/auth/twitter/callback').get(loginCtrl.loginTwitterCallback);

    /** Internal route for OAuth login flow. */
    router.route('/auth/twitter/success').get(loginCtrl.loginTwitterSuccess);

    /** Internal route for OAuth login flow. */
    router.route('/auth/twitter/failure').get(loginCtrl.loginTwitterFailure);


    /**
     * @api {GET} /auth/refresh Refresh Access Token
     * @apiName RefreshToken
     * @apiGroup Login
     *
     * @apiParam {String} refresh_token (query) The user's refresh token.
     *
     * @apiSampleRequest /auth/refresh?refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsInByb3...
     *
     * @apiSuccessExample {JSON} Refresh-Token-Success:
     *              HTTP/1.1 200 Success
     *              {
     *                  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsInByb3...",
     *              }
     * @apiErrorExample {JSON} Missing-Parameters:
     *
     *              HTTP/1.1 400 Bad Request
     *              {
     *                  "error": "Missing required parameters."
     *              }
     * @apiVersion 0.1.0
     */
    router.route('/auth/refresh').get(loginCtrl.refreshToken);

    /**
     * @api {POST} /api/incidents Create Incident
     * @apiName CreateIncident
     * @apiGroup Incident
     *
     * @apiParam {Number}       cat_id Category ID this incident falls under (see "HTTP/1.1 GET /api/categories").
     * @apiParam {JSON}         title Title for the incident.
     * @apiParam {JSON}         desc Description of the incident.
     * @apiParam {JSON}         location The location of the incident creation.
     * @apiParam {JSON}         start_date The start date reports can be made.
     * @apiParam {JSON}         end_date The last date a report can be made.
     * @apiParam {JSON}         freq Frequency of reporting. Format: "P_Y_M_DT_H_M_S". Replace underscores with desired values and leave out unwanted portions.
     * @apiParam {String}       keywords Keywords to allow grouping of common incidents (space separated).
     * @apiParam {JSON[]}       [custom_fields] Array of custom fields for reports.
     *
     * @apiHeader {String} Authorization Bearer [access_token]
     *
     * @apiParamExample {JSON} Create-Incident-Example:
     *              {
     *                  "cat_id"       : { "cat_id": 10, "desc": {String} },
     *                  "title"        : { "id": {String}, "title": {String}, "data": {String}, "type": {String} },
     *                  "desc"         : { "id": {String}, "title": {String}, "data": {String}, "type": {String} },
     *                  "location"     : { "id": {String}, "title": {String}, "data": {String}, "type": {String} },
     *                  "start_date"   : { "id": {String}, "title": {String}, "data": {String}, "type": {String} },
     *                  "end_date"     : { "id": {String}, "title": {String}, "data": {String}, "type": {String} },
     *                  "freq"         : { "id": {String}, "title": {String}, "data": {String}, "type": {String} },
     *                  "keywords"     : [{String}, {String}, ...],
     *      (Optional)  "custom_fields": [{ "id": {String}, "title": {String}, "data": {String}, "type": {String} },
     *                                   { "id": {String}, "title": {String}, "data": {String}, "type": {String} },
     *                                   ...]
     *              }
     * @apiSuccessExample {JSON} Incident-Creation-Success:
     *              HTTP/1.1 201 Created
     *              {
     *                  "location": "/api/incidents/123"
     *              }
     * @apiErrorExample {JSON} Missing-Parameters:
     *
     *              HTTP/1.1 422 Unprocessable Entity
     *              {
     *                  "error": "Missing required parameters."
     *              }
     * @apiErrorExample {JSON} Incorrect-Parameter-Structure:
     *
     *              HTTP/1.1 422 Unprocessable Entity
     *              {
     *                  "error": "The parameters are not structured correctly."
     *              }
     * @apiVersion 0.1.0
     */
    router.route('/api/incidents').post(passport.authenticate('jwt', { session: false }),
        incidentCtrl.createIncident);

    /**
     * @api {GET} /api/incidents Get All Incidents
     * @apiName GetAllIncidents
     * @apiGroup Incident
     *
     * @apiSampleRequest /api/incidents?limit=200
     *
     * @apiParam {String} [keywords] (query) Space separated string of keywords to search for.
     * @apiParam {Number} [limit]    (query) Limit the number of results to return.
     * @apiParam {Number} [offset]   (query) Offset the results for pagination.
     * @apiParam {String="xml", "json"} [format=json] (query) Output format in XML or JSON.
     *
     * @apiErrorExample {JSON} MissingParameters
     *
     *              HTTP/1.1 422 Bad Request
     *              {
     *                  "error": "Missing parameters."
     *              }
     * @apiVersion 0.1.0
     */
    router.route('/api/incidents').get(incidentCtrl.getAllIncidents);

    /**
     * @api {GET} /api/incidents/:id Get Incident
     * @apiName GetIncident
     * @apiGroup Incident
     *
     * @apiParam {String="xml", "json"} [format=json] (query) Output format in XML or JSON.
     *
     * @apiErrorExample {JSON} No-Incident-Found:
     *
     *              HTTP/1.1 404 Not Found
     *              {
     *                  "message": "Nothing found."
     *              }
     * @apiVersion 0.1.0
     */
    router.route('/api/incidents/:id').get(incidentCtrl.getIncident);

    /**
     * @api {GET} /api/users/:id/incidents Get User's Incidents
     * @apiName GetUserIncidents
     * @apiGroup Incident
     *
     * @apiParam {String="xml", "json"} [format=json] (query) Output format in XML or JSON.
     *
     * @apiErrorExample {JSON} No-Incidents-Found:
     *
     *              HTTP/1.1 404 Not Found
     *              {
     *                  "message": "Nothing found."
     *              }
     * @apiVersion 0.1.0
     */
    router.route('/api/users/:id/incidents').get(incidentCtrl.getUserIncidents);

    /**
     * @api {POST} /api/incidents Update Incident
     * @apiName UpdateIncident
     * @apiGroup Incident
     *
     * @apiParam {Number}       [cat_id] Category ID this incident falls under (see "HTTP/1.1 GET /api/categories").
     * @apiParam {JSON}         [title] Title for the incident.
     * @apiParam {JSON}         [desc] Description of the incident.
     * @apiParam {JSON}         [location] The location of the incident creation.
     * @apiParam {JSON}         [start_date] The start date reports can be made.
     * @apiParam {JSON}         [end_date] The last date a report can be made.
     * @apiParam {JSON}         [freq] Frequency of reporting. Format: "P_Y_M_DT_H_M_S". Replace underscores with desired values and leave out unwanted portions.
     * @apiParam {String}       [keywords] Keywords to allow grouping of common incidents (space separated).
     * @apiParam {JSON[]}       [custom_fields] Array of custom fields for reports.
     *
     * @apiHeader {String} Authorization Bearer [access_token]
     *
     * @apiParamExample {JSON} Update-Incident-Example:
     *              {
     *                  "cat_id"       : { "cat_id": 10, "desc": {String} },
     *                  "title"        : { "id": {String}, "title": {String}, "data": {String}, "type": {String} },
     *                  "desc"         : { "id": {String}, "title": {String}, "data": {String}, "type": {String} },
     *                  "location"     : { "id": {String}, "title": {String}, "data": {String}, "type": {String} },
     *                  "start_date"   : { "id": {String}, "title": {String}, "data": {String}, "type": {String} },
     *                  "end_date"     : { "id": {String}, "title": {String}, "data": {String}, "type": {String} },
     *                  "freq"         : { "id": {String}, "title": {String}, "data": {String}, "type": {String} },
     *                  "keywords"     : [{String}, {String}, ...],
     *                  "custom_fields": [{ "id": {String}, "title": {String}, "data": {String}, "type": {String} },
     *                                   { "id": {String}, "title": {String}, "data": {String}, "type": {String} },
     *                                   ...]
     *              }
     * @apiSuccessExample {JSON} Incident-Update-Success:
     *              HTTP/1.1 200 Success
     *              {
     *                  "location": "/api/incidents/123"
     *              }
     * @apiErrorExample {JSON} Incorrect-Parameter-Structure:
     *
     *              HTTP/1.1 422 Unprocessable Entity
     *              {
     *                  "error": "The parameters are not structured correctly."
     *              }
     * @apiVersion 0.1.0
     */
    router.route('/api/incidents/:incident_id').post(passport.authenticate('jwt', { session: false }),
        incidentCtrl.updateIncident);

    /**
     * @api {POST} /api/incidents/:incident_id/reports Create Report
     * @apiName CreateReport
     * @apiGroup Report
     *
     * @apiParam {JSON}   desc Description of the incident.
     * @apiParam {JSON}   location The location of the incident creation.
     * @apiParam {JSON[]} [custom_fields] Array of custom fields for reports.
     *
     * @apiHeader {String} Authorization Bearer [access_token]
     *
     * @apiParamExample {JSON} Create-Report-Example:
     *              {
     *                  "desc"         : { "id": {String}, "title": {String}, "data": {String}, "type": {String} },
     *                  "location"     : { "id": {String}, "title": {String}, "data": {String}, "type": {String} },
     *      (Optional)  "custom_fields": [{ "id": {String}, "title": {String}, "data": {String}, "type": {String} },
     *                                   { "id": {String}, "title": {String}, "data": {String}, "type": {String} },
     *                                   ...]
     *              }
     * @apiSuccessExample {JSON} Report-Creation-Success:
     *              HTTP/1.1 201 Success
     *              {
     *                  "location": "/api/incidents/123/reports/431"
     *              }
     * @apiErrorExample {JSON} Missing-Parameters:
     *
     *              HTTP/1.1 422 Unprocessable Entity
     *              {
     *                  "error": "Missing required parameters."
     *              }
     * @apiErrorExample {JSON} Incorrect-Parameter-Structure:
     *
     *              HTTP/1.1 422 Unprocessable Entity
     *              {
     *                  "error": "The parameters are not structured correctly."
     *              }
     * @apiVersion 0.1.0
     */
    router.route('/api/incidents/:incident_id/reports').post(passport.authenticate('jwt', { session: false }),
        reportCtrl.createReport);


    // router.route('/api/incidents/:report_id').get(reportCtrl.getReport);

    /**
     * @api {GET} /api/incidents/:incident_id/reports/:report_id Get Incident's Report
     * @apiName GetReport
     * @apiGroup Report
     *
     * @apiParam {String="xml", "json"} [format=json] (query) Output format in XML or JSON.
     *
     * @apiErrorExample {JSON} No-Incident-Found:
     *
     *              HTTP/1.1 404 Not Found
     *              {
     *                  "message": "Nothing found."
     *              }
     * @apiErrorExample {JSON} No-Report-Found:
     *
     *              HTTP/1.1 404 Not Found
     *              {
     *                  "message": "Nothing found."
     *              }
     * @apiVersion 0.1.0
     */
    router.route('/api/incidents/:incident_id/reports/:report_id').get(reportCtrl.getReportFromIncident);

    /**
     * @api {GET} /api/users/:user_id/incidents/:incident_id/reports Get User's Reports For Incident
     * @apiName GetUserReportsForIncident
     * @apiGroup Report
     *
     * @apiParam {String="xml", "json"} [format=json] (query) Output format in XML or JSON.
     *
     * @apiErrorExample {JSON} No-User-Found:
     *
     *              HTTP/1.1 404 Not Found
     *              {
     *                  "message": "Nothing found."
     *              }
     * @apiErrorExample {JSON} No-Incident-Found:
     *
     *              HTTP/1.1 404 Not Found
     *              {
     *                  "message": "Nothing found."
     *              }
     * @apiVersion 0.1.0
     */
    router.route('/api/users/:user_id/incidents/:incident_id/reports').get(reportCtrl.getUserReportsForIncident);

    /**
     * @api {GET} /api/incidents/:incident_id/reports Get Reports For Incident
     * @apiName GetReportsForIncident
     * @apiGroup Report
     *
     * @apiParam {String="xml", "json"} [format=json] (query) Output format in XML or JSON.
     *
     * @apiErrorExample {JSON} No-Incident-Found:
     *
     *              HTTP/1.1 404 Not Found
     *              {
     *                  "message": "Nothing found."
     *              }
     * @apiVersion 0.1.0
     */
    router.route('/api/incidents/:incident_id/reports').get(reportCtrl.getAllReportsForIncident);

    /**
     * @api {POST} /api/categories Create a category
     * @apiName CreateCategory
     * @apiGroup Category
     *
     * @apiParam {String} desc Description of the incident.
     *
     * @apiHeader {String} Authorization Bearer [access_token]
     *
     * @apiParamExample {JSON} Create-Category-Example:
     *              {
     *                  "desc": {String},
     *              }
     * @apiSuccessExample {JSON} Category-Creation-Success:
     *              HTTP/1.1 201 Success
     *              {
     *                  "location": "/api/categories/123"
     *              }
     * @apiErrorExample {JSON} Missing-Parameters:
     *
     *              HTTP/1.1 422 Unprocessable Entity
     *              {
     *                  "error": "Missing required parameters."
     *              }
     * @apiVersion 0.1.0
     */
    router.route('/api/categories').post(passport.authenticate('jwt', { session: false }), categoryCtrl.createCategory);

    /**
     * @api {GET} /api/categories Get All Categories
     * @apiName GetAllCategories
     * @apiGroup Category
     *
     * @apiParam {String="xml", "json"} [format=json] (query) Output format in XML or JSON.
     *
     * @apiVersion 0.1.0
     */
    router.route('/api/categories').get(categoryCtrl.getCategories);

    /**
     * @api {GET} /api/categories/:id Get Category
     * @apiName GetCategory
     * @apiGroup Category
     *
     * @apiParam {String="xml", "json"} [format=json] (query) Output format in XML or JSON.
     *
     * @apiSampleRequest /api/categories/123
     *
     * @apiErrorExample {JSON} Missing-Parameters:
     *
     *              HTTP/1.1 422 Unprocessable Entity
     *              {
     *                  "error": "Missing required parameters."
     *              }
     * @apiVersion 0.1.0
     */
    router.route('/api/categories/:cat_id').get(categoryCtrl.getCategories);





    router.route('/data/incidents').get(dataCtrl.getAllIncidents);


    router.route('/logout').get(loginCtrl.logout);

    router.route('/').get((req, res) => {
       return res.json({"message": "hello"});
    });

    return router;
};