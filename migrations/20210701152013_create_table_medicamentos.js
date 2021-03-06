
exports.up = function(knex, Promise) {
    return knex.schema.createTable('medicamentos', table =>{
        table.increments('id').primary();
        table.float('numCompartimento').notNullable();
        table.string('nomeMedicamento').notNull();
        table.float('horaToma').notNull();
        table.float('minToma').notNull();
        table.float('periodoToma').notNull();
        table.float('qtdDias').notNull();       
        table.boolean('aindaToma').notNull().defaultTo(true);
        table.string('mac').notNull();
        table.foreign('mac').references('mac').inTable('caixaMedicamentos');

    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('medicamentos');
};
