const db = require('../db/db');
const converter = require('jstoxml');

module.exports = (passport) => {
    'use strict';

    // POST /api/user
    const createUser = (req, res, next) => {
        console.log(req.body);

        if (!req.body.provider || !req.body.email || !req.body.location) {
            return res.status(422).json({ error: 'Missing parameters.' });
        }

        db.user.createUser(req.body.provider, req.body.email, req.body.location,
            (err, result) => {

                if (err) {
                    console.error("error in query: ", err);
                    return res.status(500);
                } else {
                    let user_id = result.rows[0].user_id;
                    return res.status(201).json({ location: '/api/user/' + user_id });
                }
            });
    };

    // GET /api/user/:id
    const getUserById = (req, res, next) => {

        passport.authenticate('jwt', (req, res) => {
            if (req.params.id) {
                db.user.getUserById(req.params.user_id, (err, result) => {
                    if (err) {
                        throw err;
                    } else if (result.length > 0) {
                        if (req.query.format && req.query.format === 'xml') {
                            res.set('Content-Type', 'text/xml');
                            return res.status(200).send(converter.toXML(result.rows[0], 'users', 'user'));
                        } else {
                            return res.status(200).json({ user: result.rows[0] });
                        }
                    } else {
                        return res.status(404);
                    }
                });
            } else {
                return res.status(422).json({ error: 'Invalid parameters.' })
            }
        })(req, res);
    };


    return {
        createUser : createUser,
        getUserById: getUserById
    }

};