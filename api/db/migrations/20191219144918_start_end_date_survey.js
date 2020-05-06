
exports.up = function (knex) {
    return Promise.all([
        knex.schema.table('survey', table => {
            table.timestamp('start_at').nullable();
            table.timestamp('end_at').nullable();
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.table('survey', table => {
            table.dropColumn('start_at');
            table.dropColumn('end_at');
        }),
    ]);
};
