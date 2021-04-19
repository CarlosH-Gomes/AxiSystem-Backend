module.exports = app => {

    const routes = (req,res) => {

        const mensagem = `<h1>Rotas</h1>
        <h2>/signup</h2>
        <h3>POST</h3>
        <p>JSON: { "email": string, "name": string, "password": string, "confirmPassword": string}</p>
        <h3>Retorna Sucesso ou erro</h3>
        <br>
        <h2>/signin</h2>
        <h3>POST</h3>
        <p>JSON: { "email": string, "password": string}</p>
        <h3>Retorna token</h3>
        <br>
        <br>
        <h2>/dados</h2>
        <h3>GET</h3>
        <h3>Retorna os registros de medições</h3>
        <h3>POST</h3>
        <p>JSON: { "sinalQueda": bool, "MAC": string}</p>
        <h3>Necessário o envio do token de autenticação no cabeçalho da requisição</h3>
        <br>
        <br>
        <h2>/medicamentos</h2>
        <h3>GET</h3>
        <h3>Retorna os registros de medições</h3>
        <h3>POST</h3>
        <p>JSON: { "numCompartimento": float, "nomeMedicamento": float, "horaToma": float</p>
        <p>"minToma": float, "periodoToma": float, "qtdDias": float, "aindaToma": bool}</p>
        <h3>PUT</h3>
        <p> Passar os dados os campos a serem alterados </p>
        <h3>Necessário o envio do token de autenticação no cabeçalho da requisição</h3>
        <br>
        <br>
        <h2>/medicamentos/user/:iduser</h2>
        <h3>GET</h3>
        <h3>Retorna os registros de medicações do usuario</h3>
        <h3>Necessário o envio do token de autenticação no cabeçalho da requisição</h3>
        <br>
        <br>
        <h2>/esquecisenha</h2>
        <h3>POST</h3>
        <p>JSON: {email: string}</p>
        <h3>Retorna mensagem de sucesso ou erro</h3>`

        res.send(mensagem)
    }

    return {routes}

}