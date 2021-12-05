const authSecret = process.env.AUTH_SECRET
const jwt = require('jwt-simple') //codificador 
const queries = require('./queries') 
const nodemailer = require('nodemailer') // enviar email
const { request } = require('express')


module.exports = app => {

    const { existsOrError } = app.api.validation;
    
    const save = async (req, res) => {
        let dados = { ...req.body };

        let sensor = await app.db('sensores').where({ mac: dados.mac }).first();

        if(sensor)
        {
            try {
                existsOrError(dados.sinalQueda, "Informe se caiu");
                existsOrError(dados.mac, "Informe o MAC Adress");
            } catch (msg) {
                return res.status(400).send(msg);
            }

            let sensor = await app.db('sensores').where({ mac: dados.mac }).first();

            let sensorId = null;

            if (!sensor) { 
            res.status(400).send("Sensor ainda não foi cadastrado")
            } else {
                sensorId = sensor.id;
            }
            
            dadosBackup = { ...req.body };

            delete dados.mac; //apaga o mac para não salvar no banco
            dados = {
                ...dados, sensorId,  created_At: new Date() //grava as novas informações
            } 
            console.log(dadosBackup)
            
            if (dados) {
                app.db('dadosensor').insert(dados)
                    .then(_ => res.status(200).send(dados))
                    .catch(err => res.status(500).send(err));

                    enviarEmail(dadosBackup);
            } else {
                res.status(400).send("Não foi possivel gravar");
            }
        }else{
            res.status(400).send("Não foi possivel gravar por que não foi cadastrado");
        }
        

        
    }

    const enviarEmail = async (dadosBackup) => {

        console.log(dadosBackup)

        let idUser = await app.db('sensores').where({ mac: dadosBackup.mac }).first();

        console.log(idUser.id)
        let usuario = await app.db('users').where({ id: idUser.id }).first();

        if(dadosBackup.sinalQueda == '1') {
            levantou = "não levantou"
        }else{
            levantou = "levantou"
        }
        
        const  transport = nodemailer.createTransport({
          service: 'gmail',
          secure : false,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
          },
          tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
        });
  
       
        const text = `O equipamento registrou uma queda, e o usuario ${levantou}`
  
        const mailOptions = {
          from: 'axisystem2020@gmail.com',
          to: usuario.email,
          subject: 'Notificação de queda',
          text,
          html: `<h1>Notificação de queda</h1><br><h2>O equipamento registrou uma queda, e o usuario ${levantou}</h2>` 
        };
  
        transport.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error)
            return res.status(400).send(error)
          } else {
            return res.status(200).send("Senha modificada, cheque seu e-mail");
          }
        });
      }

    const update = async (req, res) => {
        let dados = { ...req.body };
        
       

            try {
                existsOrError(dados.sinalQueda, "Informe se caiu");
                existsOrError(dados.mac, "Informe o MAC Adress");
            } catch (msg) {
                return res.status(400).send(msg);
            }

            let sensor = await app.db('sensores').where({ mac: dados.mac }).first();

            let sensorId = null;

            if (!sensor) { 
                res.status(400).send("Sensor ainda não foi cadastrado")
            } else {
                sensorId = sensor.id;
            }

            delete dados.mac; //apaga o mac para não salvar no banco
            dados = {
                ...dados, sensorId,  created_At: new Date() //grava as novas informações
            }
            app.db('dadosensor')
                .update(dados)
                .where({sensorId: sensorId})
                .then( _ => res.status(204).send()) //deu tudo certo
                .catch(err => res.status(500).send(err)) // erro do lado do servidor
        
    }
    


    const getById = async (req, res) => {
        let token = req.headers.authorization;
        token = token.replace("Bearer ", "");
        var decoded = jwt.decode(token, authSecret);

        let sensor = await  app.db('sensores')
            .select('id')
            .where({id: req.params.id, usuarioId: decoded.id }).first(); 
           
        //checa se id pertence ao usuario
        if(sensor){
            app.db('dadosensor')
                .select('sinalQueda','created_At','sensorId')
                .where({sensorId: req.params.id})
                .then(dados => res.json(dados))    
                .catch(err => res.status(500).send(err));
        }else{
            res.status(400).send("Id do sensor não encontrado")
        }

    }

    const getByIdRegistersDate = async (req, res) => {
        const today = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
        const date = req.query.data || today
        const dateQuery = `${date}`
        const id = req.params.id;

        const categories = await app.db.raw(queries.DadosdaData, [dateQuery, id])

        res.status(200).send(categories[0])
    }

    

    return { save,update, getById, getByIdRegistersDate }

}