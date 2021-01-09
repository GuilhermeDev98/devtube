
exports.up = function(knex) {
    return knex.schema
        .createTable('users', function (table) {
            table.increments('id')
            table.string('email', 255).notNullable()
            table.string('password', 255).notNullable()
            table.string('fullname', 255).notNullable()
            table.string('birth').notNullable()
            table.string('nickname', 25).notNullable()
            table.integer('channel_id', 10).unsigned().references('id').inTable('channels')
            table.enu('type', ['user', 'admin', 'support', 'streamer']).defaultTo('user').notNullable()
            table.boolean('active').defaultTo('true').notNullable()
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
        })
};

exports.down = function(knex) {
    return knex.schema.dropTable("users")
};
