const config = require("../config");

// Postgres config
const pg = require('pg');
const pool = new pg.Pool(config.pg);

pool.on('error', function (err, client) {
    // if an error is encountered by a client while it sits idle in the pool
    // the pool itself will emit an error event with both the error and
    // the client which emitted the original error
    // this is a rare occurrence but can happen if there is a network partition
    // between your application and the database, the database restarts, etc.
    // and so you might want to handle it and at least log it out
    console.error('idle client error', err.message, err.stack)
});

module.exports = {

    incident: require('./incident'),
    report  : require('./report'),
    user    : require('./user'),
    category: require('./category'),

    validField: (json) => {
        return (json.id && json.title && json.data && json.type); // && json.mandatory);
    }

};