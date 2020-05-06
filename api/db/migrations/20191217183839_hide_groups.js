
exports.up = function (knex) {
    return Promise.all([
        knex.schema.table('question_group', table => {
            table.boolean('display').default(true);
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.table('question_group', table => {
            table.dropColumn('display');
        }),
    ]);
};
