const authSecret = process.env.AUTH_SECRET
const jwt = require('jwt-simple') //codificador 
const queries = require('./queries') 

module.exports = app => {

    const { existsOrError } = app.api.validation;
    
    const save = async (req, res) => {
        let dados = { ...req.body };
        if(req.params.id) dados.id = req.params.id
        let token = req.headers.authorization;
        token = token.replace("Bearer ", "");
        var decoded = jwt.decode(token, authSecret);

        if(dados.id){
            
            let sensor = await app.db('sensores').where({ mac: dados.mac }).first();
            if(!sensor){
                try {
                    existsOrError(dados.mac, "Informe o MAC Adress");
                } catch (msg) {
                    return res.status(400).send(msg);
                }
                dados = {
                    ...dados,  created_At: new Date() //grava as novas informações
                }
                app.db('sensores')
                    .update(dados)
                    .where({id: req.params.id})
                    .then( _ => res.status(200).send()) //deu tudo certo
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
                    .then(_ => res.status(201).send(_))
                    .catch(err => res.status(500).send(err));
            } else{
                res.status(400).send("Sensor já cadastrado");
            }

        }
    }

   

    const getByIdUser = (req, res) => {
        let token = req.headers.authorization;
        token = token.replace("Bearer ", "");
        var decoded = jwt.decode(token, authSecret);
      
       app.db('sensores')
            .select('mac', 'id')
            .where({usuarioId: decoded.id})
           .then(sensor => res.json(sensor)) // deu certo, mando um json, se precisar de um processamento/tratamento, usar o map
           .catch(err => res.status(500).send(err))
    }
    
    

    return { save, getByIdUser }

}