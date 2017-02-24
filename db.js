const uuid = require('uuid');
const _ = require('underscore');

const config = require("./config");

// Postgres config
const pg = require('pg');
const pool = new pg.Pool(config.pg);


module.exports = () => {
    'use strict';

    const createUser = (provider, email, default_lat, default_long, callback) => {

        pool.connect((err, client, done) => {
            done(); // release back to pool

            if (err) {
                callback(err);
            } else {
                // verify token
                // check if user exists

                client.query('SELECT add_user($1::text, $2::text, $3::numeric, $4::numeric) AS user_id',
                    [provider, email, default_lat, default_long], (err, result) => {
                        callback(err, result);
                    }
                );
            }
        });
    };

    const getUserByEmail = (email, callback) => {
        pool.connect((err, client, done) => {
            done(); // release back to pool

            if (err) {
                callback(err);
            } else {
                client.query('SELECT user_id FROM public."user" WHERE "email" = $1::text;', [email],
                    (err, result) => {
                        callback(err, result);
                    }
                );
            }
        });
    };

    const getUserById = (id, callback) => {
        pool.connect((err, client, done) => {
            done(); // release back to pool

            if (err) {
                callback(err);
            } else {
                client.query('SELECT user_id, default_lat, default_long, credibility, created ' +
                    'FROM public."user" WHERE email = $1::int;', [id],
                    (err, result) => {
                        callback(err, result);
                    }
                );
            }
        });
    };


    const createIncident = (user_id, incident_name, desc, cat_id, latitude, longitude,
                            start_date, end_date, frequency, keywords, custom_fields,
                            callback) => {
        pool.connect((err, client, done) => {
            done(); // release back to pool

            if (err) {
                callback(err);
            } else {
                client.query('SELECT create_incident($1:: int, $2:: text, $3::text, $4::int,' +
                    ' $5::numeric, $6::numeric, $7::date, $8::date, $9::interval, $10::text[],' +
                    ' $11::json);',
                    [user_id, incident_name, desc, cat_id, latitude, longitude,
                        start_date, end_date, frequency, keywords, custom_fields],
                    (err, result) => {
                        callback(err, result);
                    }
                );
            }
        });
    };

    const getIncident = (incident_id, callback) => {
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
    };

    const getUserIncidents = (user_id, callback) => {
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
    };

    const getAllIncidents = (filters, callback) => {
        pool.connect((err, client, done) => {
            done(); // release back to pool

            if (err) {
                callback(err);
            } else {
                let params = [];
                let query = 'SELECT * FROM public.incident ';
                if (filters) {
                    if (filters.limit) {
                        query += 'LIMIT $1';
                        params.push(filters.limit);
                    }
                    if (filters.offset)  {
                        query += 'OFFSET $' + (filters.limit) ? '2' : '1';
                        params.push(filters.offset);
                    }
                }

                query += 'ORDER BY start_date ASC;';
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
    };


    pool.on('error', function (err, client) {
        // if an error is encountered by a client while it sits idle in the pool
        // the pool itself will emit an error event with both the error and
        // the client which emitted the original error
        // this is a rare occurrence but can happen if there is a network partition
        // between your application and the database, the database restarts, etc.
        // and so you might want to handle it and at least log it out
        console.error('idle client error', err.message, err.stack)
    });


    return {
        createUser    : createUser,
        getUserByEmail: getUserByEmail,
        getUserById   : getUserById,

        createIncident  : createIncident,
        getIncident     : getIncident,
        getUserIncidents: getUserIncidents,
        getAllIncidents : getAllIncidents

    }

};