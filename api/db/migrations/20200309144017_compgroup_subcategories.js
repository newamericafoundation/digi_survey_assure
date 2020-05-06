
exports.up = function (knex) {
    return Promise.all([
        knex.schema.table('survey_composite_group', table => {
            table.integer('subcategory').unsigned().index().references('survey_composite_group.id').onDelete('cascade').onUpdate('cascade').nullable();
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.table('survey_composite_group', table => {
            table.dropColumn('subcategory');
        }),
    ]);
};
