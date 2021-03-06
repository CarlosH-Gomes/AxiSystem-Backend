exports.up = function(knex) {
    return knex.schema.createTable('sensores', table => {
        table.increments('id').primary();
        table.string('mac').notNull().unique();
        table.datetime('created_At').defaultTo(knex.fn.now());
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('sensores');
  };
  