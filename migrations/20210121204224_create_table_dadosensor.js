exports.up = function(knex) {
    return knex.schema.createTable('dadosensor', table =>{
        table.increments('id').primary();
        table.boolean('sinalQueda').notNull().defaultTo(false);
        table.integer('usuarioId').unsigned().notNull();
        table.foreign('usuarioId').references('id').inTable('users');
        table.integer('sensorId').unsigned().notNull();
        table.foreign('sensorId').references('id').inTable('sensores');
        table.datetime('created_At').defaultTo(knex.fn.now());
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('dadosensor');
  };
  