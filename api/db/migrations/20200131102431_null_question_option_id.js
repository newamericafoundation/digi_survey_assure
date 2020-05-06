
exports.up = function (knex) {
    return Promise.all([
        knex.schema.table('survey_composite_item', table => {
            table.integer('question_option_id').nullable().alter();
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.table('survey_composite_item', table => {
            table.integer('question_option_id').notNullable().alter();
        }),
    ]);
};
