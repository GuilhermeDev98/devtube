
exports.up = function(knex) {
    return knex.schema.table('users', function (table) {
        table.uuid('recovery_code');
      })
};

exports.down = function(knex) {
    return knex.schema.alterTable('users', function(table) {
        table.dropUnique('recovery_code') 
     })
};
