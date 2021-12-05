const authSecret = process.env.AUTH_SECRET
const jwt = require('jwt-simple') //codificador 
const queries = require('./queries') 

module.exports = app => {

    const { existsOrError } = app.api.validation;
    
    const save = async (req, res) => {
        let dados = { ...req.body }; //pega informações do body da requisição
        if(req.params.id) dados.id = req.params.id //verifica se foi passado id
        let token = req.headers.authorization; //pega token do header para autentificação
        token = token.replace("Bearer ", ""); //remove a palavra bearer
        var decoded = jwt.decode(token, authSecret);//decodifica o token para acesar o payload


        if(dados.numCompartimento > 4) return res.status(400).send("Compatirmento inválido") // verifica se o compartimento passado é válido

        try {
            existsOrError(dados.mac, "Informe número mac"); // verifica se recebeu o mac
        } catch (msg) {
            return res.status(400).send(msg);
        }

        const consultaMacExiste = await app.db('caixaMedicamentos')
                                    .where({mac: dados.mac, usuarioId: decoded.id })
                                    .first(); //consulta se o aparelho está cadastrado

        if(!consultaMacExiste) return res.status(400).send("MAC não cadastrado") //retorna erro caso não encontre

        if(dados.aindaToma == 1){ //checa se o medicamento ainda está ativo na caixa 
            const consulta = await app.db('medicamentos')
                                        .where({mac: dados.mac, aindaToma: 1, numCompartimento: dados.numCompartimento })
                                        .first();     //alterar o medicamento  do compartimento        
            
            if(consulta) return res.status(400).send("Compartimento em uso")
        }
        
        if(dados.id){  //alterar dados do medicmento
            try {
                existsOrError(dados.horaToma, "Informe a Hora"); //valida se a hora foi informada
            } catch (msg) {
                return res.status(400).send(msg);
            }

           
            app.db('medicamentos') //altera dados do medicamento
                .update(dados)
                .where({id: dados.id})
                .then( _ => res.status(200).send()) //deu tudo certo
                .catch(err => res.status(500).send(err)) // erro do lado do servidor
        }else{ //cadastra um novo medicamento

            try {
                existsOrError(dados.numCompartimento, "Informe número Compartimento");
                existsOrError(dados.nomeMedicamento, "Informe Nome do Medicamento");
                existsOrError(dados.horaToma, "Informe a Hora");
                existsOrError(dados.minToma, "Informe o Minutos");
                existsOrError(dados.periodoToma, "Informe Intervalo de horas");
                existsOrError(dados.qtdDias, "Informe Quantidade de Dias");
                existsOrError(dados.aindaToma, "Informe se ainda toma");
            } catch (msg) {
                return res.status(400).send(msg);
            }

            
            app.db('medicamentos')
                .insert(dados)
                .then( _ => res.status(201).send()) //deu tudo certo
                .catch(err => res.status(500).send(err)) // erro do lado do servidor
        }
    }

    const get = (req, res) => {
       

        app.db('medicamentos') //consulta todas medicações do usuario
            .where({mac: req.params.mac, aindaToma: 1})
            .then(dados => res.json(dados))
            .catch(err => res.status(500).send(err));
    }

    
    const getById = (req, res) => {//consulta apenas uma medicação pelo id
       app.db('medicamentos')
            .select('numCompartimento','nomeMedicamento', 'horaToma','minToma', 'periodoToma', 'qtdDias', 'aindaToma')
            .where({id: req.params.id})
            .first()
           .then(user => res.json(user)) // deu certo, mando um json, se precisar de um processamento/tratamento, usar o map
           .catch(err => res.status(500).send(err))
    }


    return { save, get, getById }

}