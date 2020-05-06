
exports.up = function (knex) {
    return Promise.all([
        knex.schema.createTable('survey_composite', (table) => {
            table.increments('id');
            table.integer('survey_id').unsigned().index().references('survey.id').onDelete('cascade').onUpdate('cascade');
            table.string('name');
            table.text('description').nullable();
            table.jsonb('filters').nullable().comment('Format is object with: "question.id" -> question_option.id');
            table.integer('order').nullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        }),

        knex.schema.createTable('survey_composite_item', (table) => {
            table.increments('id');
            table.integer('survey_composite_id').unsigned().index().references('survey_composite.id').onDelete('cascade').onUpdate('cascade');
            table.integer('question_id').unsigned().index().references('question.id').onDelete('cascade').onUpdate('cascade');
            table.integer('question_option_id').unsigned().index().references('question_option.id').onDelete('cascade').onUpdate('cascade');
            table.decimal('weight', 5, 2).defaultTo(1.00).comment('If question_option_id is selected, add this many to the numerator total that is divided by the total responses in the survey.');
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.dropTable('survey_composite_item'),
        knex.schema.dropTable('survey_composite'),
    ]);
};
