
exports.up = function (knex) {
    return Promise.all([
        knex.schema.table('bc_transaction', table => {
            table.unique('tx_id');
            table.integer('nonce');
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.table('bc_transaction', table => {
            table.dropUnique('tx_id');
            table.dropColumn('nonce');
        }),
    ]);
};
