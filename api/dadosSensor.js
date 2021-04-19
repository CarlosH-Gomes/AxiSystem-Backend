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

        try {
            existsOrError(dados.sinalQueda, "Informe se caiu");
            existsOrError(dados.mac, "Informe o MAC Adress");
        } catch (msg) {
            return res.status(400).send(msg);
        }

        let sensor = await app.db('sensores').where({ mac: dados.mac }).first();

        let sensorId = null;

        if (!sensor) { //cadastra o sensor se não tiver
            insereSensor = async () => {
                const mpuId = app.db('sensores').insert({ mac: dados.mac })
                    .catch(err => { throw err });
                return mpuId
            }

            try {
                sensorId = await insereSensor();
            } catch (err) {
                if (err.errno === 1062) return res.status(500).send("Sensor já cadastrado");
            }
        } else {
            sensorId = sensor.id;
        }

        delete dados.mac; //apaga o mac para não salvar no banco
        dados = {
            ...dados, sensorId, usuarioId: decoded.id, created_At: new Date() //grava as novas informações
        }

        if (dados) {
            app.db('dadosensor').insert(dados)
                .then(_ => res.status(200).send(dados))
                .catch(err => res.status(500).send(err));
        } else {
            res.status(400).send("Não foi possivel gravar");
        }
    }

    // const saveStatus = async (req, res) => {
    //     let dados = { ...req.body };
    //     if(req.params.id) dados.id = req.params.id
    //     let token = req.headers.authorization;
    //     token = token.replace("bearer ", "");
    //     var decoded = jwt.decode(token, authSecret);

      
    //     let sensor = await app.db('dadosensor').where({ usuarioId: dados.id }).first();
    //     dados.id = sensor.id;

    //     try {
    //         existsOrError(dados.sinalQueda, "Informe se caiu");
            
    //     } catch (msg) {
    //         return res.status(400).send(msg);
    //     }

    //     if (dados.id) {
    //         app.db('dadosensor')
    //             .update(dados)
    //             .where({id: dados.id})
    //             .then( _ => res.status(204).send()) //deu tudo certo
    //             .catch(err => res.status(500).send(err)) // erro do lado do servidor
    //     } else {
    //         res.status(400).send("Não foi possivel alterar");
    //     }

      
    // }

    const get = (req, res) => {

        app.db('dadosensor')
            .then(dados => res.json(dados))
            .catch(err => res.status(500).send(err));
    }

    const getByIdRegistersDate = async (req, res) => {
        const today = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
        const date = req.query.data || today
        const dateQuery = `${date}`
        const id = req.params.id;

        const categories = await app.db.raw(queries.DadosdaData, [dateQuery, id])

        res.status(200).send(categories[0])
    }

    return { save, get, getByIdRegistersDate }

}