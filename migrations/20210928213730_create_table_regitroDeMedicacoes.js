
exports.up = function(knex, Promise) {
    return knex.schema.createTable('registroDeMedicamentos', table =>{
        table.increments('id').primary();
        table.float('numCompartimento').notNullable();
        table.string('nomeMedicamento').notNull();
        table.float('horaConsumido').notNull();
        table.float('minConsumido').notNull();
        table.string('mac').notNull();
        table.foreign('mac').references('mac').inTable('caixaMedicamentos');

    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('registroDeMedicamentos'); 
};
