const bodyParser = require('body-parser')
const cors = require('cors') //integração do back com front, libera acesso de um servidor ao outro (2 site)

module.exports = app => {
    app.use(bodyParser.json())
    app.use(cors())
}