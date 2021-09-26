
exports.up = function(knex, Promise) {
    return knex.schema.createTable('caixaMedicamentos', table => {
        table.increments('id').primary();
        table.string('mac').notNull().unique();
        table.datetime('created_At').defaultTo(knex.fn.now());
        table.integer('usuarioId').unsigned().notNull();
        table.foreign('usuarioId').references('id').inTable('users');
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('caixaMedicamentos');
};
