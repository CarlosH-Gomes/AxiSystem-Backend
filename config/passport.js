require('dotenv').config();
const authSecret = process.env.AUTH_SECRET
const passport = require('passport')
const passportJwt = require('passport-jwt')
const {Strategy, ExtractJwt} = passportJwt //pega authorization no cabeçario

module.exports = app => {
    const params = {
        secretOrKey: authSecret, //segredo
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()//procura no cabeçalho o token e atribui a variavel
    }

    const strategy = new Strategy(params, (payload, done)=>{ //função callback 
        app.db('users')
            .where({id: payload.id})
            .first()
            .then(user => done(null, user ? {...payload} : false))
            .catch(err => done(err, false))
    })

    passport.use(strategy)

    return{
        authenticate: () => passport.authenticate('jwt', {session: false})
    }
}