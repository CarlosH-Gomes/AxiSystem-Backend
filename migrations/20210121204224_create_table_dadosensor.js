exports.up = function(knex) {
    return knex.schema.createTable('dadosensor', table =>{
        table.increments('id').primary();
        table.boolean('sinalQueda').notNull().defaultTo(false);
        table.integer('sensorId').unsigned().notNull();
        table.foreign('sensorId').references('id').inTable('sensores');
        table.datetime('created_At').defaultTo(knex.fn.now());
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('dadosensor');
  };
  