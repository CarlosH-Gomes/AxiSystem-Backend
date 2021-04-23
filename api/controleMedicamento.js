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
            try {
                existsOrError(dados.horaToma, "Informe a Hora");
            } catch (msg) {
                return res.status(400).send(msg);
            }
            app.db('medicamentos')
                .update(dados)
                .where({id: dados.id})
                .then( _ => res.status(204).send()) //deu tudo certo
                .catch(err => res.status(500).send(err)) // erro do lado do servidor
        }else{

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

            dados = {
                ...dados, usuarioId: decoded.id//grava as novas informações
            }
            app.db('medicamentos')
                .insert(dados)
                .then( _ => res.status(204).send()) //deu tudo certo
                .catch(err => res.status(500).send(err)) // erro do lado do servidor
        }
    }

    const get = (req, res) => {

        app.db('medicamentos')
            .then(dados => res.json(dados))
            .catch(err => res.status(500).send(err));
    }

    
    const getById = (req, res) => {
        
       app.db('medicamentos')
            .select('numCompartimento','nomeMedicamento', 'horaToma','minToma', 'periodoToma', 'qtdDias', 'aindaToma')
            .where({id: req.params.id})
            .first()
           .then(user => res.json(user)) // deu certo, mando um json, se precisar de um processamento/tratamento, usar o map
           .catch(err => res.status(500).send(err))
    }

    const getByIdUser = (req, res) => {
       app.db('medicamentos')
           .select('id', 'numCompartimento', 'nomeMedicamento', 'aindaToma')
            .where({usuarioId: req.params.id})
           .then(user => res.json(user)) // deu certo, mando um json, se precisar de um processamento/tratamento, usar o map
           .catch(err => res.status(500).send(err))
    }

    return { save, get, getById, getByIdUser }

}