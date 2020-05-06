
exports.up = function (knex) {
    return Promise.all([
        knex.schema.table('cache', table => {
            table.unique('key');
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.table('cache', table => {
            table.dropUnique('key');
        }),
    ]);
};
