const bcrypt = require('bcrypt');
const crypto = require('crypto');

require('dotenv').config();

exports.seed = (knex) => {
    return knex.raw('TRUNCATE TABLE "user", survey_group, survey_access_group, survey RESTART IDENTITY CASCADE')
        .then(() => {
            return knex('survey_group').insert([
                {
                    "name": "Factory Worker Yearly Health Check",
                    "description": "Yearly health check of worker conditions.",
                    "source_plugin": "qualtrics",
                }
            ]);
        })
        .then(() => {
            return knex('survey').insert([
                {
                    "survey_group_id": 1,
                    "name": "Test Survey",
                    "description": "Sample Qualtrics survey for testing purposes.",
                    "external_source_id": "SV_dmMNPBpf4IIkIZL",
                }
            ]);
        })
        .then(() => {
            return knex('survey_access_group').insert([
                {
                    "survey_id": 1,
                    "user_group_id": 1,
                    "password": crypto.createHash('sha256').update(`${process.env.APP_SECRET}Admin123!`).digest('hex'),
                },
                {
                    "survey_id": 1,
                    "user_group_id": 2,
                    "password": crypto.createHash('sha256').update(`${process.env.APP_SECRET}Worker123!`).digest('hex'),
                }
            ]);
        })
        .then(() => {
            return knex('user').insert([
                {
                    "user_group_id": 1,
                    "username": "admin",
                    "password": bcrypt.hashSync("Workers123!", 10),
                    "email": "jonathan.belelieu+workers_rights_admin@gmail.com",
                }
            ]);
        })
};
