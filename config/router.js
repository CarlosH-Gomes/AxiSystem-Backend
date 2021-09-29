const admin = require('./admin')

module.exports = app => {

    app.post('/signup', app.api.user.save)
    app.post('/signin',  app.api.auth.signin)
    app.post('/validateToken',  app.api.auth.validateToken)
    
    app.route('/forgotPassword')
        .post(app.api.user.forgetPassword)
    
    app.route('/')
        .get(app.api.api.routes);
    
    app.route('/downloadCaixaMedicamento')
        .get(app.api.atualizaEsp8266.arquivoCaixaMedicamento);
    
    app.route('/downloadSistemaQueda')
        .get(app.api.atualizaEsp8266.arquivoSistemaQueda);

    app.route('/users')
        .all(app.config.passport.authenticate())
        .post(app.api.user.save)
        .get(app.api.user.get)

    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.user.save)) //alterar 
        .get(app.api.user.getById)

        
    app.route('/sensor')
        .all(app.config.passport.authenticate())
        .post(app.api.sensor.save)//salva o sensor
        .get(app.api.sensor.getByIdUser)//mostra sensores do usuario
    
    app.route('/sensor/:id')
        .post(app.config.passport.authenticate())
        .put(app.api.sensor.save)//altera os dados do sensor, id do sensor 


    app.route('/dados')
        .post(app.api.dadosSensor.save); //equipamento salvar informaçoes de queda
        
    
    app.route('/dados/:id')
        .get(app.config.passport.authenticate())
        .get(app.api.dadosSensor.getById); //id do sensor
         
    app.route('/caixaMedicamentos')
        .all(app.config.passport.authenticate())
        .post(app.api.caixaMedicamentos.save)//salva o caixa de medicamentos
        .get(app.api.caixaMedicamentos.getByIdUser)//mostra sensores do usuario
    
    app.route('/caixaMedicamentos/:id')
        .post(app.config.passport.authenticate())
        .put(app.api.caixaMedicamentos.save)//altera os dados do sensor, id do sensor
        .get(app.api.caixaMedicamentos.getByMac); //consulta medicamentos cadastrados na caixa 

    app.route('/caixaMedicamentosRelatorio/:id') 
        .get(app.config.passport.authenticate())
        .get(app.api.regristroDeMedicamentos.getByMac)
    
    app.route('/medicamentos')
        .all(app.config.passport.authenticate())
        .post(app.api.controleMedicamento.save);//salva o medicamento
    
    app.route('/medicamentos/:id')//id do medicamento
        .all(app.config.passport.authenticate())
        .put(app.api.controleMedicamento.save) // altera medicamentos
        .get(app.api.controleMedicamento.getById); // dados medicamento
        
    app.route('/medicamentosEnable/:mac') //equipamento
        .get(app.api.controleMedicamento.get) //select com todo medicamento cadastrado no equipamento 

    app.route('/regitroMedicamento')// rota de postar relatorio da caixa de medicamentos
        .post(app.api.regristroDeMedicamentos.save) 
        
}