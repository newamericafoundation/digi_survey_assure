
exports.up = function (knex) {
    return Promise.all([
        // knex.schema.createTable('language', (table) => {
        //     table.string('code', 24).primary();
        //     table.string('name');
        //     table.boolean('default').nullable();
        // }),

        knex.schema.createTable('question_language', (table) => {
            table.increments('id');
            table.integer('question_id').unsigned().index().references('question.id').onDelete('cascade').onUpdate('cascade');
            table.string('language').index();
            table.text('text');

            table.index(['question_id', 'language']);
        }),

        knex.schema.createTable('question_option_language', (table) => {
            table.increments('id');
            table.integer('question_option_id').unsigned().index().references('question_option.id').onDelete('cascade').onUpdate('cascade');
            table.string('language').index();
            table.text('text');

            table.index(['question_option_id', 'language']);
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.dropTable('question_option_language'),
        knex.schema.dropTable('question_language'),
        // knex.schema.dropTable('language'),
    ]);
};
