const db = require('../db/db');
const converter = require('jstoxml');

module.exports = () => {
    'use strict';

    // POST /api/categories
    const createCategory = (req, res) => {
        if (!req.body.desc) {
            return res.status(422).json({ error: 'Missing required parameters.' });
        }
        db.category.createCategory(req.body.desc, (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: (process.env.NODE_ENV == 'development') ? err : 'Something went wrong.'
                });
            }
            res.status(201).json({ location: '/api/categories/' + result.rows[0]['create_category'] });
        });
    };

    // GET /api/categories
    const getCategories = (req, res) => {
        db.category.getCategories((err, result) => {
            if (err) {
                return res.status(500).json({
                    error: (process.env.NODE_ENV == 'development') ? err : 'Something went wrong.'
                });
            }
            if (req.query.format && req.query.format === 'xml') {
                res.set('Content-Type', 'text/xml');
                return res.status(200).send(converter.toXML(result.rows, 'categories', 'category'));
            } else {
                return res.status(200).json(result.rows);
            }
        });
    };

    // GET /api/categories/:cat_id
    const getCategory = (req, res) => {
        if (!req.body.cat_id) {
            return res.status(422).json({ error: 'Missing required parameters.' });
        }

        db.category.getCategory(req.body.cat_id, (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: (process.env.NODE_ENV == 'development') ? err : 'Something went wrong.'
                });
            }
            if (req.query.format && req.query.format === 'xml') {
                res.set('Content-Type', 'text/xml');
                return res.status(200).send(converter.toXML(result.rows, 'categories', 'category'));
            } else {
                return res.status(200).json(result.rows);
            }
        });
    };


    return {
        createCategory: createCategory,
        getCategories : getCategories,
        getCategory   : getCategory
    }
};