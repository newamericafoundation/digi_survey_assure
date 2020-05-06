
exports.up = function (knex) {
    return Promise.all([
        knex.schema.createTable('survey_composite_group', (table) => {
            table.increments('id');
            table.integer('survey_id').unsigned().index().references('survey.id').onDelete('cascade').onUpdate('cascade').nullable();
            table.string('name');
            table.jsonb('metadata');
            table.integer('order').default(1);
        }),

        knex.schema.createTable('survey_composite_group_item', (table) => {
            table.increments('id');
            table.integer('survey_composite_group_id').unsigned().index().references('survey_composite_group.id').onDelete('cascade').onUpdate('cascade').nullable();
            table.integer('survey_composite_id').unsigned().index().references('survey_composite.id').onDelete('cascade').onUpdate('cascade').nullable();
            table.integer('order').default(1);

            table.unique(['survey_composite_group_id', 'survey_composite_id']);
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.dropTable('survey_composite_group_item'),
        knex.schema.dropTable('survey_composite_group'),
    ]);
};
