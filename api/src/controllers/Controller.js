//Classe do banco de dados
const database = require('../models/Database');

//Controller das rotas
class Controller {
    cadastro(req, res) {
        database.cadastro();
    }
}

module.exports = new Controller();