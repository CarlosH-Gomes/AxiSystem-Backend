const authSecret = process.env.AUTH_SECRET
const jwt = require('jwt-simple') //codificador 
const queries = require('./queries') 

module.exports = app => {

    const { existsOrError } = app.api.validation;
    
    const save = async (req, res) => {
        let dados = { ...req.body };
        if(req.params.id) dados.id = req.params.id
        let token = req.headers.authorization;
        token = token.replace("bearer ", "");
        var decoded = jwt.decode(token, authSecret);

        if(dados.id){
            
            let sensor = await app.db('sensores').where({ mac: dados.mac }).first();
            if(!sensor){
                try {
                    existsOrError(dados.mac, "Informe o MAC Adress");
                } catch (msg) {
                    return res.status(400).send(msg);
                }
                app.db('sensores')
                    .update(dados)
                    .where({id: req.params.id})
                    .then( _ => res.status(204).send()) //deu tudo certo
                    .catch(err => res.status(500).send(err)) // erro do lado do servidor
            }else{
                res.status(400).send("Sensor já foi cadastrado")
            }

        }else{ 
            try {
                existsOrError(dados.mac, "Informe o MAC Adress");
            } catch (msg) {
                return res.status(400).send(msg);
            }

            let sensor = await app.db('sensores').where({ mac: dados.mac }).first();

            
            dados = {
                ...dados, usuarioId: decoded.id, created_At: new Date() //grava as novas informações
            }
            if (!sensor) { //cadastra o sensor se não tiver
                app.db('sensores').insert(dados)
                    .then(_ => res.status(200).send(_))
                    .catch(err => res.status(500).send(err));
            } else{
                res.status(400).send("Sensor já cadastrado");
            }

        }
    }

   

    const get = (req, res) => {

        app.db('sensores')
            .then(dados => res.json(dados))
            .catch(err => res.status(500).send(err));
    }

    const getByIdUser = (req, res) => {
      
       app.db('sensores')
            .select('mac')
            .where({usuarioId: req.params.id})
           .then(sensor => res.json(sensor)) // deu certo, mando um json, se precisar de um processamento/tratamento, usar o map
           .catch(err => res.status(500).send(err))
    }
    
    const getByMac = (req, res) => {
       app.db('sensores')
            .select('id')
            .where({mac: req.params.mac})
           .then(sensor => res.json(sensor)) // deu certo, mando um json, se precisar de um processamento/tratamento, usar o map
           .catch(err => res.status(500).send(err))
    }

    return { save, get, getByIdUser, getByMac }

}