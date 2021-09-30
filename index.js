const app = require('express')()//gerenciador de requisições
const consign = require('consign') //gerencia as dependencias, carregando
const db = require('./config/db') //knex configurado
require('dotenv').config();

const swaggerDocument =  require('./src/swagger.json')
const swaggerUI = require('swagger-ui-express');
const { version } = require('moment');

app.db = db

app.use("/", swaggerUI.serve, swaggerUI.setup(swaggerDocument))

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./api')
    .then('./config/router.js')
    .into(app) //injeta as dependências



app.listen(process.env.PORT || 3000, ()=> {
    console.log("Backend executando...")
})