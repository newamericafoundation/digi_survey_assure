
exports.up = function (knex) {
    return Promise.all([
        knex.schema.createTable('survey_access_group', (table) => {
            table.increments('id');
            table.integer('survey_id').unsigned().index().references('survey.id').onDelete('cascade').onUpdate('cascade');
            table.integer('user_group_id').unsigned().index().references('user_group.id').onDelete('cascade').onUpdate('cascade');
            table.string('password');
            table.jsonb('question_access').nullable().default([]);

            table.unique(['survey_id', 'password']);
        }),

        knex.schema.table('survey_group', (table) => {
            table.dropColumn('password');
        }),

    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.table('survey_group', table => {
            table.string('password').nullable();
        }),

        knex.schema.dropTable('survey_access_group'),
    ]);
};
