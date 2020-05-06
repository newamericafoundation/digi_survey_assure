
exports.up = function (knex) {
    return Promise.all([
        knex.schema.table('question', table => {
            table.jsonb('rawData').nullable();
        })
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.table('question', table => {
            table.dropColumn('rawData');
        })
    ]);
};
