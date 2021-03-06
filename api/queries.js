module.exports = {

    DadosdaData: `select DATE_FORMAT(created_At, '%H:%i') 
    as created_At , ax , ay, az, gy, gx, gz 
    from dadosMpu where DATE(created_At) = ? AND usuarioId = ?; `
}