//Database
const database = require('../models').produtos;

const produtos = async (req, res) => {
    try {
        const data = await database.findAll({where: {disponivel: true}}); //Filtrar todos os produtos disponíveis
        
        return res.status(200).json({
            success: true,
            products: data
        })
    }
    catch(e) {
        return res.status(500).json({
            success: false,
            name: 'Não foi possível buscar os produtos',
            error: e.message
        })
    }
};

module.exports = produtos;