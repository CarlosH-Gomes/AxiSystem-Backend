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


        if(dados.numCompartimento > 4) return res.status(400).send("Compatirmento inválido")

        try {
            existsOrError(dados.mac, "Informe número mac");
        } catch (msg) {
            return res.status(400).send(msg);
        }

        const consultaMacExiste = await app.db('caixaMedicamentos')
                                    .where({mac: dados.mac, usuarioId: decoded.id })
                                    .first();

        if(!consultaMacExiste) return res.status(400).send("MAC não cadastrado")

        if(dados.aindaToma == 1){
            const consulta = await app.db('medicamentos')
                                        .where({mac: dados.mac, aindaToma: 1, numCompartimento: dados.numCompartimento })
                                        .first();                  
            
            if(consulta) return res.status(400).send("Compartimento em uso")
        }
        
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

            
            app.db('medicamentos')
                .insert(dados)
                .then( _ => res.status(204).send()) //deu tudo certo
                .catch(err => res.status(500).send(err)) // erro do lado do servidor
        }
    }

    const get = (req, res) => {
       

        app.db('medicamentos')
            .where({mac: req.params.mac, aindaToma: 1})
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


    return { save, get, getById }

}