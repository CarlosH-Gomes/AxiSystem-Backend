
exports.up = function(knex, Promise) {
    return knex.schema.createTable('medicamentos', table =>{
        table.increments('id').primary();
        table.float('numCompartimento').notNullable();
        table.string('nomeMedicamento').notNull();
        table.float('horaToma').notNull();
        table.float('minToma').notNull();
        table.float('periodoToma').notNull();
        table.string('qtdDias').notNull();       
        table.boolean('aindaToma').notNull().defaultTo(true);
        table.integer('usuarioId').unsigned().notNull();
        table.foreign('usuarioId').references('id').inTable('users');
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('medicamentos');
};
