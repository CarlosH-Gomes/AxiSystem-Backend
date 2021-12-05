const authSecret = process.env.AUTH_SECRET
const jwt = require('jwt-simple') //codificador 
const queries = require('./queries') 

module.exports = app => { //adiciona o método ao app

    const { existsOrError } = app.api.validation; //método de validação
    
    const save = async (req, res) => {
        let dados = { ...req.body }; //recebe informações do body
        if(req.params.id) dados.id = req.params.id //verifica se foi passado um id
        let token = req.headers.authorization; //token de cautentificação do usuário
        token = token.replace("Bearer ", "");//extrai palavra bearer do token
        var decoded = jwt.decode(token, authSecret); //decodifica o payload 

        if(dados.id){ //se possuir id é alteração 
            
            let sensor = await app.db('sensores').where({ mac: dados.mac }).first();// consulta seo sensor foi cadastrado no banco
            if(!sensor){// se está cadastrado no banco
                try {
                    existsOrError(dados.mac, "Informe o MAC Adress");//Mac não informado
                } catch (msg) {
                    return res.status(400).send(msg); // retorna mac não cadastrado
                }
                dados = {
                    ...dados,  created_At: new Date() //grava as novas informações
                }
                app.db('sensores') //altera no banco
                    .update(dados)
                    .where({id: req.params.id})
                    .then( _ => res.status(200).send()) //deu tudo certo
                    .catch(err => res.status(500).send(err)) // erro do lado do servidor
            }else{ //caso não esteja cadastrado sensor no banco
                res.status(400).send("Sensor já foi cadastrado") 
            }

        }else{ //caso não tenha id, é um novo sensor
            try {
                existsOrError(dados.mac, "Informe o MAC Adress"); // se o mac não foi informado
            } catch (msg) {
                return res.status(400).send(msg);
            }

            let sensor = await app.db('sensores').where({ mac: dados.mac }).first(); //pega informações do sensor cadastrado

            
            dados = {
                ...dados, usuarioId: decoded.id, created_At: new Date() //grava as novas informações no obtejo
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
        let token = req.headers.authorization;  //recebe o token 
        token = token.replace("Bearer ", ""); //remove a palavre bearer
        var decoded = jwt.decode(token, authSecret); //decodifica o payload
      
       app.db('sensores') //faz a consulta e retorna a solicitação
            .select('mac', 'id')
            .where({usuarioId: decoded.id})
           .then(sensor => res.json(sensor)) // deu certo, mando um json, se precisar de um processamento/tratamento
           .catch(err => res.status(500).send(err))
    }
    
    

    return { save, getByIdUser }

}