
exports.up = function (knex) {
    return Promise.all([
        knex.schema.createTable('question_type', (table) => {
            table.increments('id');
            table.string('mapping_class', 50);
            table.text('description').nullable();
        }),

        knex('question_type').insert([
            { mapping_class: "bar", description: "Vertical bar chart display." },
            { mapping_class: "pie", description: "Pie chart display." },
        ]),

        knex.schema.createTable('survey_group', (table) => {
            table.increments('id');
            table.string('name', 100);
            table.text('description').nullable();
            table.string('source_plugin', 50);
            table.string('password').nullable();
            table.jsonb('metadata').nullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        }),

        knex.schema.createTable('survey', (table) => {
            table.increments('id');
            table.integer('survey_group_id').unsigned().index().references('survey_group.id').onDelete('cascade').onUpdate('cascade');
            table.text('external_source_id').unique().nullable();
            table.text('name');
            table.text('description').nullable();
            table.string('listener_code', 64);
            table.jsonb('metadata').nullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        }),

        knex.schema.createTable('question_group', (table) => {
            table.increments('id');
            table.integer('survey_id').unsigned().index().references('survey.id').onDelete('cascade').onUpdate('cascade');
            table.string('name', 100);
            table.text('description').nullable();
            table.jsonb('metadata').nullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        }),

        knex.schema.createTable('question', (table) => {
            table.increments('id');
            table.integer('question_group_id').unsigned().index().nullable().references('question_group.id').onDelete('cascade').onUpdate('cascade');
            table.integer('question_type_id').unsigned().index().references('question_type.id').onUpdate('cascade');
            table.integer('survey_id').unsigned().index().references('survey.id').onDelete('cascade').onUpdate('cascade');
            table.text('external_source_id').nullable();
            table.text('text');
            table.jsonb('metadata').nullable();
            table.integer('order').unsigned().nullable();

            table.unique(['survey_id', 'external_source_id']);
        }),

        knex.schema.createTable('question_option', (table) => {
            table.increments('id');
            table.integer('question_id').unsigned().index().nullable().references('question.id').onDelete('cascade').onUpdate('cascade');
            table.text('raw_value');
            table.text('legible_value').nullable();
            table.integer('times_selected').unsigned().default(0);
            table.integer('order').unsigned().nullable();
            table.jsonb('metadata').nullable();

            table.unique(['question_id', 'raw_value']);
        }),

        knex.schema.createTable('location', (table) => {
            table.increments('id');
            table.string('name', 100);
            table.decimal('lat', 17, 13).nullable();
            table.decimal('long', 17, 13).nullable();
            table.jsonb('metadata').nullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        }),

        knex.schema.createTable('user_group', (table) => {
            table.increments('id');
            table.string('name', 50);
            table.jsonb('permissions').nullable();
        }),

        knex('user_group').insert([
            { name: "Administrator", permissions: { admin: true } },
            { name: "Public", permissions: { admin: false } },
        ]),

        knex.schema.createTable('user', (table) => {
            table.increments('id');
            table.integer('user_group_id').unsigned().index().references('user_group.id').onUpdate('cascade');
            table.integer('location_id').unsigned().index().references('location.id').onUpdate('cascade');
            table.text('external_source_id').nullable();
            table.string('username', 100).nullable().index();
            table.string('password').nullable();
            table.string('email', 100).nullable();
            table.integer('age').nullable();
            table.integer('gender').nullable().comment('1 = Female, 2 = Male');
            table.string('language', 5).defaultTo('en-US');
            table.jsonb('metadata').nullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        }),

        knex.schema.createTable('bc_transaction', (table) => {
            table.increments('id');
            table.string('tx_id', 68).index();
            table.jsonb('options').nullable();
            table.jsonb('receipt').nullable();
            table.string('network', 50);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        }),

        knex.schema.createTable('survey_response', (table) => {
            table.increments('id');
            table.integer('survey_id').unsigned().index().references('survey.id').onDelete('cascade').onUpdate('cascade');
            table.integer('user_id').unsigned().nullable().index().references('user.id').onDelete('cascade').onUpdate('cascade');
            table.integer('location_id').unsigned().nullable().index().references('location.id').onUpdate('cascade');
            table.integer('bc_transaction_id').unsigned().nullable().index().references('bc_transaction.id').onUpdate('cascade');
            table.text('external_source_id').unique().nullable();
            table.string('confirmation_hash', 32).comment('The hash of the IRegisterResponse array, also what is placed on the blockchain.');
            table.jsonb('raw_response').nullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
            table.timestamp('recorded_at').nullable();
            table.jsonb('metadata').nullable();
        }),

        knex.schema.createTable('survey_response_answer', (table) => {
            table.increments('id');
            table.integer('survey_response_id').unsigned().index().references('survey_response.id').onDelete('cascade').onUpdate('cascade');
            table.integer('question_id').unsigned().index().references('question.id').onDelete('cascade').onUpdate('cascade');
            table.integer('question_option_id').unsigned().index().references('question_option.id').onDelete('cascade').onUpdate('cascade');
            table.jsonb('metadata').nullable();
        }),

        knex.schema.createTable('cache', (table) => {
            table.increments('id');
            table.string('key', 50);
            table.text('value');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('expires_at').nullable();
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.dropTable('cache'),
        knex.schema.dropTable('survey_response_answer'),
        knex.schema.dropTable('survey_response'),
        knex.schema.dropTable('bc_transaction'),
        knex.schema.dropTable('user'),
        knex.schema.dropTable('user_group'),
        knex.schema.dropTable('location'),
        knex.schema.dropTable('question_option'),
        knex.schema.dropTable('question'),
        knex.schema.dropTable('question_group'),
        knex.schema.dropTable('survey'),
        knex.schema.dropTable('survey_group'),
        knex.schema.dropTable('question_type'),
    ]);
};
