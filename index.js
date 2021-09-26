const app = require('express')()//gerenciador de requisições
const consign = require('consign') //gerencia as dependencias, carregando
const db = require('./config/db') //knex configurado
require('dotenv').config();

const swaggerJSDoc =  require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express');
const { version } = require('moment');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API axisystem",
            version: "1.0.0",
            description: "Documentacao da API"
        }, 
        servers:[
            {
                url: "http://localhost:3000"
            }
        ],
       
    },
    apis: ["./src/*.js"]
}

const swaggerDocument = swaggerJSDoc(options)

app.db = db

app.use("/caifora", swaggerUI.serve, swaggerUI.setup(swaggerDocument))

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