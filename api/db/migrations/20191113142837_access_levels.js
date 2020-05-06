const bcrypt = require('bcrypt');
require('dotenv').config();

const adminCredentials = process.env.ADMIN_CREDENTIALS.split(':');

exports.up = function (knex) {
    return Promise.all([
        knex('user').insert([
            {
                user_group_id: 1,
                username: adminCredentials[0],
                password: bcrypt.hashSync(adminCredentials[1], 10),
                language: process.env.DEFAULT_LOCALE
            },
        ]),

        knex.schema.table('question', table => {
            table.boolean('public').unsigned().default(true);
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.table('question', table => {
            table.dropColumn('public');
        }),
    ]);
};
