
exports.up = function (knex) {
    return Promise.all([
        knex.schema.table('survey', table => {
            table.string('url').unique();
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.table('survey', table => {
            table.dropColumn('url');
        }),
    ]);
};
