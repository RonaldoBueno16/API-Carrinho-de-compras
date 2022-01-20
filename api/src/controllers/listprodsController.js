const {Validator} = require('jsonschema');

//Database
const database = require('../models').produtos;

//Validação de JSON - JSONSCHEMA
const v = new Validator();

//Web Token
const jwt = require('jsonwebtoken');

const listProds = async (req, res) => {
    try {
        const data = await database.findAll({where: {disponivel: true}}); //Filtrar todos os produtos disponíveis
        
        res.status(200).json({
            success: true,
            products: data
        })
    }
    catch(e) {
        res.status(500).json({
            success: false,
            name: 'Não foi possível buscar os produtos',
            error: e.message
        })
    }
};

module.exports = listProds;