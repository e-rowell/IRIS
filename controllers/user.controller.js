const config = require("../config");

const db = require('../db')();

module.exports = (passport) => {
    'use strict';

    // POST /api/user
    const createUser = (req, res, next) => {
        console.log(req.body);

        if (!req.body.source_id || !req.body.email || !req.body.default_lat || !req.body.default_long) {
            return res.status(400).json({ error: 'Missing parameters.' });
        }

        db.createUser(req.body.source_id, req.body.email, req.body.default_lat, req.body.default_long,
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

    // GET /api/user/id:
    const getUser = (req, res, next) => {

        passport.authenticate('jwt', (req, res) => {
            if (req.params.id) {
                db.getUserById(req.params.id, (err, result) => {
                    if (err) {
                        throw err;
                    } else if (result.length > 0) {
                        return res.status(200).json({ user: result[0] });
                    } else {
                        return res.status(404);
                    }
                });
            } else {
                return res.status(400).json({ error: 'Invalid parameters.' })
            }
        })(req, res);
    };


    return {
        createUser: createUser,
        getUser   : getUser
    }

};