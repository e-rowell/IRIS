const config = require("../config");

// Postgres config
const pg = require('pg');
const pool = new pg.Pool(config.pg);


module.exports = {

    createUser: (provider, email, default_location, callback) => {

        pool.connect((err, client, done) => {
            done(); // release back to pool

            if (err) {
                callback(err);
            } else {

                client.query('SELECT add_user($1::text, $2::text, $3::text) AS user_id',
                    [provider, email, default_location], (err, result) => {
                        callback(err, result);
                    }
                );
            }
        });
    },

    getUserByEmail: (email, callback) => {
        pool.connect((err, client, done) => {
            done(); // release back to pool

            if (err) {
                callback(err);
            } else {
                client.query('SELECT user_id, email, default_location, credibility, created FROM public."user" WHERE "email" = $1::text;', [email],
                    (err, result) => {
                        callback(err, result);
                    }
                );
            }
        });
    },

    getUserById: (id, callback) => {
        pool.connect((err, client, done) => {
            done(); // release back to pool

            if (err) {
                callback(err);
            } else {
                client.query('SELECT user_id, email, default_location, credibility, created ' +
                    'FROM public."user" WHERE user_id = $1::int;', [id],
                    (err, result) => {
                        callback(err, result);
                    }
                );
            }
        });
    }
    //
    // return {
    //     createUser    : createUser,
    //     getUserByEmail: getUserByEmail,
    //     getUserById   : getUserById
    // };

};