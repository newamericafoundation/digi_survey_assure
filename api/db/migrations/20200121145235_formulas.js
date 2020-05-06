
exports.up = function (knex) {
    return Promise.all([
        knex.schema.table('survey_composite', table => {
            table.string('formula').nullable().after('description');
            table.jsonb('metadata').nullable().after('formula');
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.table('survey_composite', table => {
            table.dropColumn('formula');
            table.dropColumn('metadata');
        }),
    ]);
};
