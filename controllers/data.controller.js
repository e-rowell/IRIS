const db = require('../db/db');
const converter = require('jstoxml');
const xmlConverter = require('../utils/toXml');

module.exports = () => {
    'use strict';

    // GET /data/incidents
    const getAllIncidents = (req, res, next) => {

        db.incident.getAllIncidents({ limit: req.query.limit, offset: req.query.offset,
            keywords: req.query.keywords }, (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: (process.env.NODE_ENV == 'development') ? err : 'Something went wrong.'
                });
            }
            if (result.rowCount) {
                if (req.query.format && req.query.format === 'xml') {
                    res.set('Content-Type', 'text/xml');
                    return res.status(200).send(xmlConverter.toXml(result.rows, 'incidents', 'incident'));
                } else {
                    return res.status(200).json(result.rows);
                }
            } else {
                return res.status(404).json({ message: 'Nothing found.' });
            }
        });
    };

    // GET /data/incidents/:incident_id/reports
    const getIncidentReports = (req, res, next) => {



    };

    return {
        createIncident  : createIncident,
        getIncident     : getIncident,
        getUserIncidents: getUserIncidents,
        getAllIncidents : getAllIncidents
    }

};