
exports.up = function (knex) {
    return Promise.all([
        knex.schema.createTable('survey_question_filter', (table) => {
            table.increments('id');
            table.integer('survey_id').unsigned().index().references('survey.id').onDelete('cascade').onUpdate('cascade');
            table.integer('question_id').unsigned().index().references('question.id').onDelete('cascade').onUpdate('cascade');
            table.string('label');
            table.integer('order');
        }),

        // Remove these in favor of filters on questions.
        knex.schema.table('user', table => {
            table.dropColumn('age');
            table.dropColumn('gender');
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.dropTable('survey_question_filter'),

        knex.schema.table('user', table => {
            table.integer('age').nullable();
            table.integer('gender').nullable().comment('1 = Female, 2 = Male');
        }),
    ]);
};
