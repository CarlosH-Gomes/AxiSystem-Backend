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

    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.user.save)) //alterar 
        .get(app.api.user.getById)

    app.route('/sensor')
        .post(app.config.passport.authenticate())
        .post(app.api.sensor.save)//salva o sensor
        .get(app.api.sensor.get)
    
    app.route('/sensor/:id')
        .post(app.config.passport.authenticate())
        .get(app.api.sensor.getByIdUser) //passa id do usuario checar sensores cadastrados
        .put(app.api.sensor.save)//altera os dados do sensor, id do sensor
   
    app.route('/requisicaoSensor/:mac')
        .get(app.api.sensor.getByMac)//sensor checa se foi cadastrado

    app.route('/dados')
        .post(app.config.passport.authenticate())
        .post(app.api.dadosSensor.save)
        .put(app.api.dadosSensor.update); // rota que será usada pelo hardware
        
    
    app.route('/dados/:id')
        .post(app.config.passport.authenticate())
        .get(app.api.dadosSensor.getById); //id do sensor
         

     app.route('/medicamentos')
        .all(app.config.passport.authenticate())
        .get(app.api.controleMedicamento.get) //todos medicamentos da base de dados
        .post(app.api.controleMedicamento.save);//salva o medicamento
    
    app.route('/medicamentos/:id')//id do medicamento
        .all(app.config.passport.authenticate())
        .put(app.api.controleMedicamento.save) // altera medicamentos
        .get(app.api.controleMedicamento.getById) // dados medicamento
        
    app.route('/medicamentos/user/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.controleMedicamento.getByIdUser) //select com todo medicameno usuario

    app.route('/esquecisenha')
        .post(app.api.user.forgetPassword)
}