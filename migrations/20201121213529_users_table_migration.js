
exports.up = function(knex) {
    return knex.schema
        .createTable('users', function (table) {
            table.increments('id')
            table.string('email', 255).notNullable()
            table.string('password', 255).notNullable()
            table.string('fullname', 255).notNullable()
            table.string('birth').notNullable()
            table.string('nickname', 50).notNullable()
            table.integer('channel_id', 10).unsigned().references('id').inTable('channels');
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
        })
};

exports.down = function(knex) {
    return knex.schema.dropTable("users")
};
