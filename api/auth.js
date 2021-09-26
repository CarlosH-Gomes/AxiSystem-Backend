require('dotenv').config();
const authSecret = process.env.AUTH_SECRET
const jwt = require('jwt-simple') //api para autentificar usuário
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const signin = async (req, res) => {
        if(!req.body.email || !req.body.password){
            return res.status(400).send('Informe usuário e senha!')
        }

        const user = await app.db('users')
            .where({ email: req.body.email })
            .first()

        if(!user) return res.status(400).send('Usuário não encontrado!')

        const isMatch = bcrypt.compareSync(req.body.password, user.password)
        if(!isMatch) return res.status(401).send( 'Email/senha inválidos')

        const now = Math.floor(Date.now() / 1000)

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            iat: now
            //exp: now //+ (60*60*24*3) //tempo do token - 3 dias
        }
        res.json({
            ...payload,
           token: jwt.encode(payload, authSecret) //token para acesso que fica no front
        })
    }

    const validateToken = async (req, res) =>{
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