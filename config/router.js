const admin = require('./admin')

module.exports = app => {
    app.post('/signup', app.api.user.save)
    app.post('/signin',  app.api.auth.signin)
    app.post('/validateToken',  app.api.auth.validateToken)
    
    app.route('/')
        .get(app.api.api.routes);

    app.route('/users')
        .all(app.config.passport.authenticate())
        .post(app.api.user.save)
        .get(app.api.user.get)

    app.route('/users/:id')//alterar 
        .all(app.config.passport.authenticate())
        .put(admin(app.api.user.save)) 
        .get(app.api.user.getById)

    app.route('/dados')
        .post(app.config.passport.authenticate())
        .get(app.api.dadosSensor.get)
        .post(app.api.dadosSensor.save);

    app.route('/dados/:id')
        .all(app.config.passport.authenticate())
        //.put(app.api.dadosSensor.saveStatus) 
        .get(app.api.dadosSensor.getByIdRegistersDate)

     app.route('/medicamentos')
        .post(app.config.passport.authenticate())
        .get(app.api.controleMedicamento.get)
        .post(app.api.controleMedicamento.save);
    
    app.route('/medicamentos/:id')//alterar 
        .all(app.config.passport.authenticate())
        .put(app.api.controleMedicamento.save) 
        .get(app.api.controleMedicamento.getById)
        
    app.route('/medicamentos/user/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.controleMedicamento.getByIdUser)

    app.route('/esquecisenha')
        .post(app.api.user.forgetPassword)
}