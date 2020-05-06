
exports.up = function (knex) {
    return Promise.all([
        knex.schema.table('question_group', table => {
            table.integer('order');
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.table('question_group', table => {
            table.dropColumn('order');
        }),
    ]);
};
