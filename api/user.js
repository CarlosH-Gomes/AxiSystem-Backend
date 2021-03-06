require('dotenv').config();
const bcrypt = require('bcrypt-nodejs')
const nodemailer = require('nodemailer') // enviar email

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const encrtptPassword = password => {
        const salt = bcrypt.genSaltSync(10) //numero de repetiçoes para processar os dados
        return bcrypt.hashSync(password, salt) //senha criptografada, hash
    }

    const save = async (req, res) => {
        const user = {...req.body} //um json intercpetado pelo bodyparser, transformo em objeto, e com explade espalhamos
        if(req.params.id) user.id = req.params.id
        
        if(!req.originalUrl.startsWith('/users')) user.admin = false //não consegue cadastra adm por user sem sem adm
        if(!req.user || !req.user.admin) user.admin = false //não consegue cadastra adm no signup sem ser adm

        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'Email não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de senha Inválida')
            equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem')

            const userFromDB = await app.db('users')
                                        .where({email: user.email}).first()
            if(!user.id){ //se encontra um id do usuario no banco
                notExistsOrError(userFromDB, 'Usuário ja cadastrador')
            }
        } catch(msg) {
            return res.status(400).send(msg)
        }

        user.password = encrtptPassword(user.password) //criptografa a senha
        delete user.confirmPassword //remove o confirma senha para armazenar no banco

        if(user.id){
            app.db('users')
                .update(user)
                .where({id: user.id})
                .then( _ => res.status(200).send('Sucesso')) //deu tudo certo
                .catch(err => res.status(500).send(err)) // erro do lado do servidor
        }else{
            app.db('users')
                .insert(user)
                .then( _ => res.status(201).send('Sucesso')) //deu tudo certo
                .catch(err => res.status(500).send(err)) // erro do lado do servidor
        }
    }
       
    
    const forgetPassword = async (req, res) => { //em desenvolvimento (mailtrap)
        //esqueceu senha
        const email = req.body.email;
    
        //verifica se o email fo cadastrado
        const user = await app.db('users')
          .where({ email: req.body.email })
          .first();
    
        if (!user) return res.status(400).send("Email não cadastrado");//retorna erro
    
        //cria uma nova senha
        const password = Math.random().toString(36).slice(-10);
      
        //criptografa e adiciona ao banco a nova senha
        user.password = encrtptPassword(password);
        app.db('users').update(user).where({ id: user.id }).then(_ => enviarEmail())
          .catch(err => res.status(400).send(err));
    
          //rotina de envio de email quando esqueceu senha, e configuração
        const enviarEmail = () => {
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
          
          //texto que será enviado
          const text = `Sua senha gerada aleatóriamente é '${password}', você pode altera-lá posteriormente no aplicativo`
    
          //conteudo e endereço do email
          const mailOptions = {
            from: 'axisystem2020@gmail.com',
            to: email,
            subject: 'Recuperação de Senha',
            text,
            html: `<h1>Sua nova senha é ${password}</h1>` 
          };
    
          //envio do email
          transport.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error)
              return res.status(400).send(error)
            } else {
              return res.status(200).send("Senha modificada, cheque seu e-mail");
            }
          });
        }
      }


    const get = (req, res) => {
         //retorna todos usuarios
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .then(users => res.json(users)) // deu certo, mando um json, se precisar de um processamento/tratamento, usar o map
            .catch(err => res.status(500).send(err))
     }

     const getById = (req, res) => {
        //retorna usuario escolhido
       app.db('users')
           .select('id', 'name', 'email', 'admin')
            .where({id: req.params.id})
            .first()
           .then(user => res.json(user)) // deu certo, mando um json, se precisar de um processamento/tratamento, usar o map
           .catch(err => res.status(500).send(err))
    }

    return {save, get, getById, forgetPassword}

}