
exports.up = function (knex) {
    return Promise.all([
        knex.schema.dropTable('survey_composite_group_item'),

        knex.schema.table('survey_composite', table => {
            table.integer('survey_composite_group_id').unsigned().index().references('survey_composite_group.id').onDelete('cascade').onUpdate('cascade').nullable()
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.table('survey_composite', table => {
            table.dropColumn('survey_composite_group_id')
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
