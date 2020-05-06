
exports.up = function (knex) {
    return Promise.all([
        knex.schema.createTable('survey_group_item_mapping', (table) => {
            table.increments('id');
            table.integer('root_survey_id').unsigned().index().references('survey.id').onDelete('cascade').onUpdate('cascade');
            table.integer('question_id').unsigned().nullable().unique().references('question.id').onDelete('cascade').onUpdate('cascade');
            table.jsonb('mapped_questions').nullable().comment('Array of question IDs on other surveys which match the question ID on the root survey.');
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.dropTable('survey_group_item_mapping'),
    ]);
};
