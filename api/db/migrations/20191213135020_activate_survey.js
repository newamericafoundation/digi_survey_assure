
exports.up = function (knex) {
    return Promise.all([
        knex.schema.table('survey', table => {
            table.boolean('active').default(false);
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.table('survey', table => {
            table.dropColumn('active');
        }),
    ]);
};
