const config = require("../config");

// Postgres config
const pg = require('pg');
const pool = new pg.Pool(config.pg);

module.exports = {

    createReport: (user_id, incident_id, desc, location, custom_fields, callback) => {
        pool.connect((err, client, done) => {
            done(); // release back to pool

            if (err) {
                callback(err);
            } else {
                client.query('SELECT create_report($1::int, $2::int, $3::jsonb, $4::jsonb,' +
                    ' $5::jsonb);',
                    [user_id, incident_id, desc, location, custom_fields],
                    (err, result) => {
                        callback(err, result);
                    }
                );
            }
        });
    },

    getReport: (report_id, callback) => {
        pool.connect((err, client, done) => {
            done(); // release back to pool

            if (err) {
                callback(err);
            } else {
                client.query('SELECT * FROM public.report WHERE report_id = $1::int;',
                    [report_id],
                    (err, result) => {
                        callback(err, result);
                    }
                );
            }
        });
    },

    getReportFromIncident: (incident_id, report_id, callback) => {
        pool.connect((err, client, done) => {
            done(); // release back to pool

            if (err) {
                callback(err);
            } else {
                client.query('SELECT * FROM public.report WHERE incident_id = $1::int' +
                    ' AND report_id = $2::int;',
                    [incident_id, report_id],
                    (err, result) => {
                        callback(err, result);
                    }
                );
            }
        });
    },

    getUserReportsForIncident: (user_id, incident_id, callback) => {
        pool.connect((err, client, done) => {
            done(); // release back to pool

            if (err) {
                callback(err);
            } else {
                client.query('SELECT * FROM public.report WHERE user_id = $1::int ' +
                    'AND incident_id = $2::int;',
                    [user_id, incident_id],
                    (err, result) => {
                        callback(err, result);
                    }
                );
            }
        });
    },

    getAllReportsForIncident: (filters, incident_id, callback) => {
        pool.connect((err, client, done) => {
            'use strict';

            done(); // release back to pool

            if (err) {
                callback(err);
            } else {
                let params = [];
                let query = 'SELECT * FROM public.report WHERE incident_id = $1::int';
                params.push(incident_id);
                if (filters) {
                    if (filters.limit) {
                        query += ' LIMIT $2';
                        params.push(filters.limit);
                    }
                    if (filters.offset) {
                        query += ' OFFSET $' + (filters.limit) ? '3' : '2';
                        params.push(filters.offset);
                    }
                }

                query += " ORDER BY created DESC;";

                // if (filters) query += 'WHERE ';
                // if (filters.start_before) query += '';
                // if (filters.start_after) query += '';

                client.query(query, params,
                    (err, result) => {
                        callback(err, result);
                    }
                );
            }
        });
    }

    // return {
    //     createReport             : createReport,
    //     getReport                : getReport,
    //     getUserReportsForIncident: getUserReportsForIncident,
    //     getAllReportsForIncident : getAllReportsForIncident
    // }
};