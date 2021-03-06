const config = require('../knexfile.js')
const knex = require('knex')(config)

knex.migrate.latest([config])//executa as migrations quando carrega o back
module.exports = knex