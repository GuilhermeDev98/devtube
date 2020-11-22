
exports.up = function(knex) {
  
  return knex.schema
        .createTable('channel_tag', function (table) {
            table.integer('tag_id').references('id').inTable('tags');
            table.integer('channel_id').references('id').inTable('channels');
        })
};

exports.down = function(knex) {
    return knex.schema.dropTable("channel_tag")
};
