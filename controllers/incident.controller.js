const config = require("../config");
const jwt = require('jsonwebtoken');

// Postgres config
const pg = require('pg');

const db = require('../db/db');


module.exports = (passport) => {
    'use strict';


    // POST /api/incidents
    const createIncident = (req, res, next) => {

        // TODO: user_id should be pulled from JWT
        if (!req.body.user_id || !req.body.title || !req.body.desc || !req.body.cat_id ||
            !req.body.location || !req.body.start_date || !req.body.end_date || !req.body.freq ||
            !req.body.keywords) {
            return res.status(422).json({ error: 'Missing required parameters.' });
        }

        // ensure parameters meet the json format
        if (!req.body.user_id  || !req.body.cat_id || !db.validField(req.body.title) ||
            !db.validField(req.body.desc) || !db.validField(req.body.location) ||
            !db.validField(req.body.start_date) || !db.validField(req.body.end_date) ||
            !db.validField(req.body.freq) || !db.validField(req.body.keywords)) {
            return res.status(422).json({ error: 'The parameters are not structured correctly.' });
        }

        db.incident.createIncident(req.body.user_id, req.body.title, req.body.desc, req.body.cat_id,
            req.body.location, req.body.start_date, req.body.end_date, req.body.freq, req.body.keywords,
            req.body.custom_fields,
            (err, result) => {
                if (err) {
                    return res.status(500).json({
                        error: (process.env.NODE_ENV == 'development') ? err : 'Something went wrong.'
                    });
                }

                res.status(201).json({ location: '/api/incidents/' + result.rows[0]['create_incident'] });
            });
    };

    // GET /api/incidents/:incident_id
    const getIncident = (req, res, next) => {
        if (!req.params.id) {
            next();
            return;
        }
        db.incident.getIncident(req.params.id, (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: (process.env.NODE_ENV == 'development') ? err : 'Something went wrong.'
                });
            }
            if (result.rowCount) {
                return res.status(200).json(result.rows[0]);
            } else {
                return res.status(404).json({ message: 'Nothing found.' });
            }
        })
    };

    // GET /api/:user_id/incidents
    const getUserIncidents = (req, res, next) => {
        if (!req.params.id) {
            return res.status(422).json({ error: 'Missing required parameters.' });
        }
        db.incident.getUserIncidents(req.params.id, (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: (process.env.NODE_ENV == 'development') ? err : 'Something went wrong.'
                });
            }
            if (result.rowCount) {
                return res.status(200).json(result.rows);
            } else {
                return res.status(404).json({ message: 'Nothing found.' });
            }
        });
    };

    // GET /api/incidents
    const getAllIncidents = (req, res, next) => {

        db.incident.getAllIncidents({ limit: req.query.limit, offset: req.query.offset }, (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: (process.env.NODE_ENV == 'development') ? err : 'Something went wrong.'
                });
            }
            if (result.rowCount) {
                return res.status(200).json(result.rows);
            } else {
                return res.status(404).json({ message: 'Nothing found.' });
            }
        });
    };

    // POST /api/incidents/:incident_id
    const updateIncident = (req, res, next) => {



    };

    return {
        createIncident  : createIncident,
        getIncident     : getIncident,
        getUserIncidents: getUserIncidents,
        getAllIncidents : getAllIncidents
    }

};