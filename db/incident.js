const config = require("../config");

// Postgres config
const pg = require('pg');
const pool = new pg.Pool(config.pg);

module.exports = {

    createIncident: (user_id, incident_name, desc, cat_id, location,
                     start_date, end_date, frequency, keywords, custom_fields,
                     callback) => {
        pool.connect((err, client, done) => {
            done(); // release back to pool

            if (err) {
                callback(err);
            } else {
                client.query('SELECT create_incident($1::int, $2::int, $3::jsonb, $4::jsonb,' +
                    ' $5::jsonb, $6::jsonb, $7::jsonb, $8::jsonb, $9::jsonb, $10::jsonb);',
                    [user_id, cat_id, desc, incident_name, location,
                        start_date, end_date, frequency, keywords, custom_fields],
                    (err, result) => {
                        callback(err, result);
                    }
                );
            }
        });
    },

    getIncident: (incident_id, callback) => {
        pool.connect((err, client, done) => {
            done(); // release back to pool

            if (err) {
                callback(err);
            } else {
                client.query('SELECT * FROM public.incident WHERE incident_id = $1::int;',
                    [incident_id],
                    (err, result) => {
                        callback(err, result);
                    }
                );
            }
        });
    },

    getUserIncidents: (user_id, callback) => {
        pool.connect((err, client, done) => {
            done(); // release back to pool

            if (err) {
                callback(err);
            } else {
                client.query('SELECT * FROM public.incident WHERE user_id = $1::int;',
                    [user_id],
                    (err, result) => {
                        callback(err, result);
                    }
                );
            }
        });
    },

    getAllIncidents: (filters, callback) => {
        pool.connect((err, client, done) => {
            'use strict';

            done(); // release back to pool

            if (err) {
                callback(err);
            } else {
                let params = [];
                let query = 'SELECT * FROM public.incident';
                if (filters) {
                    if (filters.limit) {
                        query += ' LIMIT $1';
                        params.push(filters.limit);
                    }
                    if (filters.offset) {
                        query += ' OFFSET $' + (filters.limit) ? '2' : '1';
                        params.push(filters.offset);
                    }
                }

                query += " ORDER BY start_date::jsonb->>'data' ASC;";

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
    //
    // return {
    //     createIncident  : createIncident,
    //     getIncident     : getIncident,
    //     getUserIncidents: getUserIncidents,
    //     getAllIncidents : getAllIncidents
    // };
};