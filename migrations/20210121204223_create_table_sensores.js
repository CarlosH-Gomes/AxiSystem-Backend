exports.up = function(knex) {
    return knex.schema.createTable('sensores', table => {
        table.increments('id').primary();
        table.string('mac').notNull().unique();
        table.datetime('created_At').defaultTo(knex.fn.now());
        table.integer('usuarioId').unsigned().notNull();
        table.foreign('usuarioId').references('id').inTable('users');
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('sensores');
  };
  