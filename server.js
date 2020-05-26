// configurando o servidor
const express = require("express")
const server = express()

//configurar o servidor para apresentar arquivos estáticos "css, scripts, imagens"
server.use(express.static('public'))

//Habilitar body do formulário
server.use(express.urlencoded({ extended: true }))

//Conexão ao Banco de dados (Postgres)
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

// configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true, //boolean ou booleano
})

// configurando a apresentação da página
server.get("/", function(req, res){
    
    db.query("SELECT * FROM donors", function(err, result){
        if(err) return res.send("erro de banco de dados.")
        
        const donors = result.rows
        return res.render("index.html", { donors })
    })

    
})
server.post("/", function(req, res){
    // Pegar dados do formulário.
    // OBS: O "body" pode estar desabilitado por padrão, caso esteja, habilite no "express"
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    //Verificando se as caixas de textos estão vazias
    if(name == "" || email == "" || blood == ""){
        return res.send("Todos os campos devem ser preenchidos.")
    }

    // adiciona valores dentro do banco de dados
    const query = 
        `INSERT INTO donors ("name", "email", "blood")
        VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err){
        //Fluxo de erro
        if(err) return res.send("erro no banco de dados")
        
        //Fluxo Ideal
        return res.redirect("/")
    })
})

// ligando o servidor e permitindo o acesso na porta 3000
server.listen(3000, function(){
    console.log("O servidor foi iniciado")
})