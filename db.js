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
        getUserById   : getUserById
    }

};