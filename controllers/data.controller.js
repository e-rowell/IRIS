const db = require('../db/db');
const converter = require('jstoxml');
const xmlConverter = require('../utils/toXml');
const Archiver = require('archiver');

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
                res.writeHead(200, {
                    'Content-Type': 'application/zip',
                    'Content-disposition': 'attachment; filename=data.zip'
                });
                let zip = Archiver('zip');
                zip.pipe(res);

                if (req.query.format && req.query.format === 'xml') {

                    zip.append(xmlConverter.toXml(JSON.stringify(result.rows), 'incidents', 'incident'),
                        { name: 'data.xml' });
                    zip.finalize();
                } else {
                    zip.append(JSON.stringify(result.rows), { name: 'data.json' });
                    zip.finalize();
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
        getAllIncidents : getAllIncidents
    }

};