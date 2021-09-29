const authSecret = process.env.AUTH_SECRET
const jwt = require('jwt-simple') //codificador 
const queries = require('./queries') 

module.exports = app => {

    const { existsOrError } = app.api.validation;

    const save = async (req, res) => {
        let dados = { ...req.body };

        let sensor = await app.db('caixaMedicamentos').where({ mac: dados.mac }).first();

        if(sensor)
        {
            try {
                existsOrError(dados.numCompartimento, "Informe o numero do compartimento");
                existsOrError(dados.nomeMedicamento, "Informe o nome do medicamento");
                existsOrError(dados.horaConsumido, "Informe a hora que foi consumida");
                existsOrError(dados.minConsumido, "Informe o minuto que foi consumida");
                existsOrError(dados.mac, "Informe o MAC Adress");
            } catch (msg) {
                return res.status(400).send(msg);
            }

            if (dados) {
                app.db('registroDeMedicamentos').insert(dados)
                    .then(_ => res.status(200).send(dados))
                    .catch(err => res.status(500).send(err));
            } else {
                res.status(400).send("Não foi possivel gravar");
            }
        }else{
            res.status(400).send("Não foi possivel gravar por que não foi cadastrado");
        }

    }

    const getByMac = async(req,res) => {
        let token = req.headers.authorization;
        token = token.replace("Bearer ", "");
        var decoded = jwt.decode(token, authSecret);
      
      var consultaId =  await app.db('caixaMedicamentos')
                                    .select('mac','id')
                                    .where({usuarioId: decoded.id, id: req.params.id}).first()
        
       if(!consultaId) return res.status(400).send('Sensor não encontrado!')

        app.db('registroDeMedicamentos')
            .where({mac: consultaId.mac})
           .then(sensor => res.json(sensor)) 
           .catch(err => res.status(500).send(err))
    }

    return{save, getByMac}
}