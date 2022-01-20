//Validação de JSON
const {Validator} = require('jsonschema');
const v = new Validator();

//Database
const database_usuarios = require('../models').usuarios;
const database_prods = require('../models').produtos;
const database_carrinhos = require('../models').carrinhos;
const database_itens_carrinho = require('../models').itens_carrinho;

//Web Token
const jwt = require('jsonwebtoken');

const GetCarrinho = async (req, res) => {
    const schema = {
        type: 'object',
        properties: {
            token: {type: 'string'} //TOKEN DE AUTENTICAÇÃO DO USUÁRIO
        },
        required: ['token']
    }

    const data = req.headers;
    
    const token = data.token;
    let user_id = -1;
    
    //Verificar se o token ainda é válido
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if(err) {
            return res.status(406).json({
                success: false,
                auth: false,
                message: "Usuário não autenticado, logue novamente!"
            })
        }
        else {
            console.log(decoded);
            user_id = decoded.id;
        }
    })

    //Verificar se o token atual corresponde ao token do banco de dados
    try {
        const datauser = await database_usuarios.findByPk(user_id);
        
        if(datauser == null) { //Caso o usuário por erro não exista na tabela
            return res.status(500).json({
                success: false,
                auth: false,
                http_response: 500,
                message: "Não foi possível trazer o carrinho do usuário"
            })
        }

        //Verificar se o token atual corresponde ao token do banco de dados
        if(datauser.token != token) {
            return res.status(406).json({
                success: false,
                auth: false,
                message: "Usuário não autenticado, logue novamente!"
            })
        }
        
    }
    catch(e) {
        return res.status(500).json({
            success: false,
            auth: true,
            http_response: 500,
            message: "Não foi possível trazer o carrinho do usuário",
            error: e.message
        })
    }

    //Trazer o carrinho do cliente
    try {
        let carrinho = await database_carrinhos.findOne({where: {usuarios_id: user_id}});

        //Caso o usuário não tenha um carrinho, criar um carrinho
        if(carrinho.length == 0) {
            try {
                carrinho = await database_carrinhos.create({
                    usuarios_id: user_id,
                    num_produtos: 0,
                    total: 0,
                    subtotal: 0
                });
            }
            catch(e) {
                return res.status(500).json({
                    success: false,
                    auth: true,
                    http_response: 500,
                    message: "Não foi possível trazer o carrinho do usuário",
                    error: e.message
                })
            }
        }
        
        let itens_carrinho;
        //Trazer todos os itens do carrinho do cliente
        try {
            itens_carrinho = await database_itens_carrinho.findAll({where: {carrinhos_id: carrinho.id}})
        }
        catch(e) {
            return res.status(500).json({
                success: false,
                auth: true,
                http_response: 500,
                message: "Não foi possível trazer o carrinho do usuário",
                error: e.message
            })
        }
        
        res.status(200).json({
            success: true,
            auth: true,
            carrinho: {
                num_produtos: carrinho.num_produtos,
                total: carrinho.total,
                subtotal: carrinho.subtotal
            },
            itens_carrinho: itens_carrinho
        })
    }
    catch(e) {
        return res.status(500).json({
            success: false,
            auth: true,
            http_response: 500,
            message: "Não foi possível trazer o carrinho do usuário",
            error: e.message
        })
    }
};

module.exports = GetCarrinho;