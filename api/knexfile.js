require('dotenv').config();

let knexConfig = {
    client: 'pg',
    // searchPath: ['knex', 'public'],
    pool: {
        min: 0,
        max: 20,
        acquireTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
        createTimeoutMillis: 30000,
    },
    migrations: {
        directory: './db/migrations',
    },
    seeds: {
        directory: './db/seeds'
    },
    debug: (process.env.DEBUG === 'false') ? false : true,
};

// The pg package v8+ breaks Heroku integation. If you upgrade you will need
// to use "rejectUnauthorized": false in the connection object.
// ssl: { rejectUnauthorized: false },
if (process.env.DATABASE_URL) {
    let connectionString = process.env.DATABASE_URL;

    if (process.env.DATABASE_USE_SSL === 'true') {
        connectionString += '?ssl=true';
    }

    knexConfig.connection = connectionString;
} else {
    knexConfig.connection = {
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        database: process.env.PGDATABASE,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        ssl: (process.env.DATABASE_USE_SSL === 'true') ? true : false,
    }
}

module.exports = knexConfig;
