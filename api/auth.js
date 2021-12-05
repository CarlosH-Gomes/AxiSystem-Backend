require('dotenv').config();
const authSecret = process.env.AUTH_SECRET
const jwt = require('jwt-simple') //api para autentificar usuário
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const signin = async (req, res) => {
        if(!req.body.email || !req.body.password){ //verifica se recebeu usuario e seha
            return res.status(400).send('Informe usuário e senha!')
        }

        const user = await app.db('users') //consulta no banco se o usario está cadastrado
            .where({ email: req.body.email })
            .first()

        if(!user) return res.status(400).send('Usuário não encontrado!') //retorna que nãoo encontrou o usuario

        const isMatch = bcrypt.compareSync(req.body.password, user.password) //compara a senha do banco com a informada pelo usuário
        if(!isMatch) return res.status(401).send( 'Email/senha inválidos') // retorna erro caso as senha não sejam identicas 

        const now = Math.floor(Date.now() / 1000) // tempo de duração do token de autentificação

        const payload = { //construção do payload
            id: user.id,
            name: user.name,
            email: user.email,
            iat: now
            //exp: now //+ (60*60*24*3) //tempo do token - 3 dias
        }
        res.json({ //retorna o payload para o usario, em forma de token que será usado para login
            ...payload,
           token: jwt.encode(payload, authSecret) //token para acesso que fica no front
        })
    }

    const validateToken = async (req, res) =>{ //valida o token passado pelo usuario
        const userdata = req.body || null
        try  {
            if(userdata){
                const token = jwt.decode(userdata.token, authSecret)
                if(new Date(token.exp *1000) > new Date()){ //multiplica por 1000 pra ficar em seg
                    return res.send(true) //aqui podemos enviar um novo token - revalidando o tempo
                }
            }
        }catch(e){
            //problema com o token
        }

        res.send(false)
    }
    return{signin, validateToken}
}