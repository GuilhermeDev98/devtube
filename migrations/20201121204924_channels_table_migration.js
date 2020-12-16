
exports.up = function(knex) {
    return knex.schema
    .createTable('channels', function (table) {
        table.increments('id')
        table.string('name', 20).notNullable()
        table.string('description', 255).notNullable()
        table.string('bio').notNullable()
        table.boolean('online').defaultTo(false)
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("channels")
};
