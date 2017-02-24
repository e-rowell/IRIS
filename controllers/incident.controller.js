const config = require("../config");
const jwt = require('jsonwebtoken');

// Postgres config
const pg = require('pg');

const db = require('../db')();


module.exports = (passport) => {
    'use strict';


    // POST /api/incidents
    const createIncident = (req, res, next) => {
        let body = req.body;
        if (!body.user_id || !body.name || !body.desc || !body.cat_id || !body.lat || !body.long || !body.start || !body.end || !body.freq || !body.keywords) {
            return res.status(400).json({ error: 'Missing required parameters.' });
            //return res.status(400).json(body);
        }

        db.createIncident(body.user_id, body.name, body.desc, body.cat_id,
            body.lat, body.long, body.start, body.end, body.freq, body.keywords, body.custom_fields,
            (err, result) => {
                if (err) {
                    return res.status(500).json({
                        error: (process.env.NODE_ENV == 'development') ? err : 'Something went wrong.'
                    });
                }

                res.status(201).json({ location: '/api/incident/' + result.rows[0]['create_incident'] });
            });
    };

    // GET /api/incidents/:incident_id
    const getIncident = (req, res, next) => {
        if (!req.params.id) {
            next();
            return;
        }
        db.getIncident(req.params.id, (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: (process.env.NODE_ENV == 'development') ? err : 'Something went wrong.'
                });
            }
            if (result.rowCount) {
                return res.status(200).json({ incident: result.rows[0] });
            } else {
                return res.status(404).json({ error: 'No record found with that ID.' });
            }
        })
    };

    // GET /api/:user_id/incidents
    const getUserIncidents = (req, res, next) => {
        if (!req.params.id) {
            return res.status(400).json({ error: 'Missing required parameters.' });
        }
        db.getUserIncidents(req.params.id, (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: (process.env.NODE_ENV == 'development') ? err : 'Something went wrong.'
                });
            }
            if (result.rowCount) {
                return res.status(200).json({ incidents: result.rows });
            } else {
                return res.status(404).json({ error: 'No record found with that ID.' });
            }
        });

    };

    // GET /api/incidents
    const getAllIncidents = (req, res, next) => {

        db.getAllIncidents({ limit: req.query.limit, offset: req.query.offset }, (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: (process.env.NODE_ENV == 'development') ? err : 'Something went wrong.'
                });
            }
            if (result.rowCount) {
                return res.status(200).json({ incidents: result.rows });
            } else {
                return res.status(404).json({ error: 'No records found.' });
            }
        });

    };



    return {
        createIncident  : createIncident,
        getIncident     : getIncident,
        getUserIncidents: getUserIncidents,
        getAllIncidents : getAllIncidents
    }

};