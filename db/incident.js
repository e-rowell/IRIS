const config = require("../config");

// Postgres config
const pg = require('pg');
const pool = new pg.Pool(config.pg);

module.exports = {

    createIncident: (user_id, title, desc, cat_id, location,
                     start_date, end_date, frequency, keywords, custom_fields,
                     callback) => {
        pool.connect((err, client, done) => {
            done(); // release back to pool

            if (err) {
                callback(err);
            } else {
                client.query('SELECT create_incident($1::int, $2::jsonb, $3::jsonb, $4::int,' +
                    ' $5::jsonb, $6::jsonb, $7::jsonb, $8::jsonb, $9::jsonb, $10::jsonb);',
                    [user_id, title, desc, cat_id, location,
                        start_date, end_date, frequency, keywords, custom_fields],
                    (err, result) => {
                        callback(err, result);
                    }
                );
            }
        });
    },

    getIncident: (incident_id, options, callback) => {
        pool.connect((err, client, done) => {
            done(); // release back to pool

            if (err) {
                callback(err);
            } else {
                var query;
                if (options.dev)
                    query = 'SELECT * FROM public.incident WHERE incident_id = $1::int;';
                else
                    query = `SELECT i.user_id, i.incident_id, c."desc", i.created,  
                                     i.title::json->>'data' AS title,
                                     i."desc"::json->>'data' AS desc,
                                     i.location::json->>'data' AS location,
                                     i.start_date::json->>'data' AS start_date,
                                     i.end_date::json->>'data' AS end_date,
                                     i.frequency::json->>'data' AS frequency,
                                     i.keywords::json->>'data' AS keywords,
                                     i.custom_fields::json->>'data' AS custom_fields
                                     FROM public.incident i
                                     JOIN public.category c ON c.cat_id = i.cat_id`;
                client.query(query,
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
                    if (filters.keywords) {
                        params.push(filters.keywords);

                        if (filters.dev)
                            query = `SELECT * FROM keyword_search($${params.length})`;
                        else
                            query = `SELECT ks.user_id, ks.incident_id, c."desc", ks.created,  
                                     ks.title::json->>'data' AS title,
                                     ks."desc"::json->>'data' AS desc,
                                     ks.location::json->>'data' AS location,
                                     ks.start_date::json->>'data' AS start_date,
                                     ks.end_date::json->>'data' AS end_date,
                                     ks.frequency::json->>'data' AS frequency,
                                     ks.keywords::json->>'data' AS keywords,
                                     ks.custom_fields::json->>'data' AS custom_fields
                                     FROM keyword_search($${params.length}) ks
                                     JOIN public.category c ON c.cat_id = ks.cat_id`;
                    } else {
                        if (filters.dev)
                            query = `SELECT * FROM public.incident`;
                        else
                            query = `SELECT user_id, incident_id, c."desc", created,  
                                     i.title::json->>'data' AS title,
                                     i."desc"::json->>'data' AS desc,
                                     i.location::json->>'data' AS location,
                                     i.start_date::json->>'data' AS start_date,
                                     i.end_date::json->>'data' AS end_date,
                                     i.frequency::json->>'data' AS frequency,
                                     i.keywords::json->>'data' AS keywords,
                                     i.custom_fields::json->>'data' AS custom_fields
                                     FROM public.incident i
                                     JOIN public.category c ON c.cat_id = i.cat_id`;
                    }

                    if (filters.limit) {
                        params.push(filters.limit);
                        query += ' LIMIT $'+ params.length;
                        console.log(`params length: ${params.length}, limit: ${filters.limit}`)
                    }
                    if (filters.offset) {
                        params.push(filters.offset);
                        query += ' OFFSET $' + params.length;
                    }

                }

                query += " ORDER BY start_date::jsonb->>'data' DESC;";

                client.query(query, params,
                    (err, result) => {
                        callback(err, result);
                    }
                );
            }
        });
    },
    updateIncident:  (incident_id, title, desc, cat_id, location, start_date, end_date, frequency, keywords, custom_fields,
                      callback) => {
        pool.connect((err, client, done) => {
            done(); // release back to pool

            if (err) {
                callback(err);
            } else {
                var query = 'UPDATE public.incident SET ';

                if (title) query += `title = ${title},`;
                if (cat_id) query += `cat_id = ${cat_id},`;
                if (location) query += `location = ${location},`;
                if (start_date) query += `end_date = ${start_date},`;
                if (end_date) query += `end_date = ${end_date},`;
                if (frequency) query += `frequency = ${frequency},`;
                if (keywords) query += `keywords = ${keywords},`;
                if (custom_fields) query += `custom_fields = ${custom_fields},`;

                query = query.substr(0, query.length - 1); // remove last comma

                query += ` WHERE incident_id = ${incident_id};`;

                client.query(query, (err, result) => {
                        callback(err, result);
                    }
                );
            }
        });
    },
    //
    // return {
    //     createIncident  : createIncident,
    //     getIncident     : getIncident,
    //     getUserIncidents: getUserIncidents,
    //     getAllIncidents : getAllIncidents
    // };
};