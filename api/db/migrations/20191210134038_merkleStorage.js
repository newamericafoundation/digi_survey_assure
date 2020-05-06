
exports.up = function (knex) {
    return Promise.all([
        knex.schema.table('bc_transaction', table => {
            table.string('merkle_root');
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.table('bc_transaction', table => {
            table.dropColumn('merkle_root');
        }),
    ]);
};
