
exports.up = function (knex) {
    return Promise.all([
        knex.schema.table('survey_response_answer', table => {
            table.dropColumn('metadata');
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.table('survey_response_answer', table => {
            table.jsonb('metadata').nullable();
        }),
    ]);
};
