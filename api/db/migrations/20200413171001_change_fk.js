
exports.up = function (knex) {
    return Promise.all([
        knex.schema.table('survey_composite', table => {
            table.dropForeign('survey_composite_group_id');

            table.foreign('survey_composite_group_id').references('survey_composite_group.id').onDelete('set null').onUpdate('cascade');
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.table('survey_composite', table => {
            table.dropForeign('survey_composite_group_id');

            table.foreign('survey_composite_group_id').references('survey_composite_group.id').onDelete('cascade').onUpdate('cascade');
        }),
    ]);
};
