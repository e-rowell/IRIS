const db = require('../db/db');
const converter = require('jstoxml');

module.exports = () => {
    'use strict';

    // POST /api/incidents/:incident_id/reports
    const createReport = (req, res, next) => {

        // TODO: user_id should be pulled from JWT
        if (!req.body.user_id || !req.body.desc || !req.body.location) {
            return res.status(422).json({ error: 'Missing required parameters.' });
        }

        // ensure parameters meet the json format
        if (!db.validField(req.body.desc) || !db.validField(req.body.location) ||
            (req.body.custom_fields && !db.validField(req.body.custom_fields))) {
            return res.status(422).json({ error: 'The parameters are not structured correctly.' });
        }


        db.report.createReport(req.body.user_id, req.params.incident_id, req.body.desc,
            req.body.location, req.body.custom_fields, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        error: (process.env.NODE_ENV == 'development') ? err : 'Something went wrong.'
                    });
                }

                res.status(201).json({ location: '/api/incidents/'+ req.params.incident_id +
                '/reports/' + result.rows[0]['create_report'] });
            });
    };

    // GET /api/incidents/reports/:report_id
    const getReport = (req, res, next) => {
        if (req.params.id) {
            next();
            return;
        }

        db.report.getReport(req.params.report_id, (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: (process.env.NODE_ENV == 'development') ? err : 'Something went wrong.'
                });
            }
            if (result.rowCount) {
                if (req.query.format && req.query.format === 'xml') {
                    res.set('Content-Type', 'text/xml');
                    return res.status(200).send(converter.toXML(result.rows[0], 'reports', 'report'));
                } else {
                    return res.status(200).json(result.rows[0]);
                }
            } else {
                return res.status(404).json({ message: 'Nothing found.' });
            }
        })
    };

    // GET /api/incidents/:incident_id/reports
    const getAllReportsForIncident = (req, res, next) => {

        db.report.getAllReportsForIncident({ limit: req.query.limit, offset: req.query.offset },
            req.params.incident_id, (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: (process.env.NODE_ENV == 'development') ? err : 'Something went wrong.'
                });
            }
            if (result.rowCount) {
                if (req.query.format && req.query.format === 'xml') {
                    res.set('Content-Type', 'text/xml');
                    return res.status(200).send(converter.toXML(result.rows, 'reports', 'report'));
                } else {
                    return res.status(200).json(result.rows);
                }
            } else {
                return res.status(404).json({ message: 'Nothing found.' });
            }
        });

    };

    // GET /api/incidents/:incident_id/reports/:report_id
    const getReportFromIncident = (req, res, next) => {
        if (req.params.id) {
            next();
            return;
        }

        db.report.getReportFromIncident(req.params.incident_id, req.params.report_id, (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: (process.env.NODE_ENV == 'development') ? err : 'Something went wrong.'
                });
            }
            if (result.rowCount) {
                if (req.query.format && req.query.format === 'xml') {
                    res.set('Content-Type', 'text/xml');
                    return res.status(200).send(converter.toXML(result.rows[0], 'reports', 'report'));
                } else {
                    return res.status(200).json(result.rows[0]);
                }
            } else {
                return res.status(404);
            }
        })
    };




    // GET /api/users/:id/incidents/:incident_id/reports
    const getUserReportsForIncident = (req, res, next) => {
        if (!req.params.id) {
            return res.status(422).json({ error: 'Missing required parameters.' });
        }
        db.report.getUserReportsForIncident(req.params.id, req.params.incident_id, (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: (process.env.NODE_ENV == 'development') ? err : 'Something went wrong.'
                });
            }
            if (result.rowCount) {
                if (req.query.format && req.query.format === 'xml') {
                    res.set('Content-Type', 'text/xml');
                    return res.status(200).send(converter.toXML(result.rows, 'reports', 'report'));
                } else {
                    return res.status(200).json(result.rows);
                }
            } else {
                return res.status(404).json({ message: 'Nothing found.' });
            }
        });
    };



    return {
        createReport: createReport,
        getReport: getReport,
        getReportFromIncident: getReportFromIncident,
        getUserReportsForIncident: getUserReportsForIncident,
        getAllReportsForIncident: getAllReportsForIncident
    }

};