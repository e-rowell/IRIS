const config = require("../config");

// Postgres config
const pg = require('pg');
const pool = new pg.Pool(config.pg);

module.exports = {

    createCategory: (desc, callback) => {
        pool.connect((err, client, done) => {
            done(); // release back to pool

            if (err) {
                callback(err);
            } else {
                client.query('SELECT create_category($1::text);',
                    [desc],
                    (err, result) => {
                        callback(err, result);
                    }
                );
            }
        });
    },
    getCategories: (callback) => {
        pool.connect((err, client, done) => {
            done(); // release back to pool

            if (err) {
                callback(err);
            } else {
                client.query('SELECT * FROM public.category',
                    [],
                    (err, result) => {
                        callback(err, result);
                    }
                );
            }
        });
    },
    getCategory: (cat_id, callback) => {
        pool.connect((err, client, done) => {
            done(); // release back to pool

            if (err) {
                callback(err);
            } else {
                client.query('SELECT * FROM public.category WHERE cat_id = $1::int',
                    [cat_id],
                    (err, result) => {
                        callback(err, result);
                    }
                );
            }
        });
    }


};