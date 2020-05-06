
exports.up = function (knex) {
    return Promise.all([
        knex('location').whereNull('metadata').update({ metadata: {} }),
        knex.schema.alterTable('location', table => {
            table.jsonb('metadata').default({}).notNullable().alter();
        }),

        knex('question').whereNull('metadata').update({ metadata: {} }),
        knex.schema.alterTable('question', table => {
            table.jsonb('metadata').default({}).notNullable().alter();
        }),

        knex('question_group').whereNull('metadata').update({ metadata: {} }),
        knex.schema.alterTable('question_group', table => {
            table.jsonb('metadata').default({}).notNullable().alter();
        }),

        knex('question_option').whereNull('metadata').update({ metadata: {} }),
        knex.schema.alterTable('question_option', table => {
            table.jsonb('metadata').default({}).notNullable().alter();
        }),

        knex('survey').whereNull('metadata').update({ metadata: {} }),
        knex.schema.alterTable('survey', table => {
            table.jsonb('metadata').default({}).notNullable().alter();
        }),

        knex('survey_composite').whereNull('metadata').update({ metadata: {} }),
        knex.schema.alterTable('survey_composite', table => {
            table.jsonb('metadata').default({}).notNullable().alter();
        }),

        knex('survey_composite_group').whereNull('metadata').update({ metadata: {} }),
        knex.schema.alterTable('survey_composite_group', table => {
            table.jsonb('metadata').default({}).notNullable().alter();
        }),

        knex('survey_group').whereNull('metadata').update({ metadata: {} }),
        knex.schema.alterTable('survey_group', table => {
            table.jsonb('metadata').default({}).notNullable().alter();
        }),

        knex('survey_response').whereNull('metadata').update({ metadata: {} }),
        knex.schema.alterTable('survey_response', table => {
            table.jsonb('metadata').default({}).notNullable().alter();
        }),

        knex('user').whereNull('metadata').update({ metadata: {} }),
        knex.schema.alterTable('user', table => {
            table.jsonb('metadata').default({}).notNullable().alter();
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.alterTable('user', table => { table.jsonb('metadata').nullable().alter(); }),
        knex.schema.alterTable('survey_response', table => { table.jsonb('metadata').nullable().alter(); }),
        knex.schema.alterTable('survey_group', table => { table.jsonb('metadata').nullable().alter(); }),
        knex.schema.alterTable('survey_composite_group', table => { table.jsonb('metadata').nullable().alter(); }),
        knex.schema.alterTable('survey_composite', table => { table.jsonb('metadata').nullable().alter(); }),
        knex.schema.alterTable('survey', table => { table.jsonb('metadata').nullable().alter(); }),
        knex.schema.alterTable('question_option', table => { table.jsonb('metadata').nullable().alter(); }),
        knex.schema.alterTable('question_group', table => { table.jsonb('metadata').nullable().alter(); }),
        knex.schema.alterTable('question', table => { table.jsonb('metadata').nullable().alter(); }),
        knex.schema.alterTable('location', table => { table.jsonb('metadata').nullable().alter(); }),
    ]);
};
