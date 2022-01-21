//Mysql2

//Validação de JSON
const {Validator} = require('jsonschema');
const v = new Validator();

//Sequelize
const sequ = require('sequelize');

//Database
const database_usuarios = require('../models').usuarios;
const database_prods = require('../models').produtos;
const database_carrinhos = require('../models').carrinhos;
const database_itens_carrinho = require('../models').itens_carrinho;

const GetCarrinho = async (req, res, next) => {
    const user_id = req.user_id;
    const token = req.token;
    
    //Comparar token com o do banco de dados para evitar logins simuntâneos
    try {
        const usuario = await database_usuarios.findByPk(user_id);

        if(usuario == null) {
            return res.status(403).json({
                success: false,
                auth: false,
                message: "Não foi possível localizar o usuário"
            });
        }

        if(usuario.token != token) {
            res.status(403).json({
                success: false,
                auth: false,
                message: "Usuário não autenticado"
            })
        }
    }
    catch(e) {
        return res.status(500).json({
            success: false,
            message: "Não foi possível trazer o carrinho do usuário",
            error: e.message
        })
    }

    //Trazer o carrinho do usuário
    try {
        //Buscar o carrinho e os itens
        let carrinho = await database_carrinhos.findOne(
            {where: {usuarios_id: user_id}, 
            include: [{
                model: database_itens_carrinho, 
                as: "itens_carrinho", 
                required: true
            }]
        });
        
        //Caso não encontre carrinho + produtos
        if(carrinho == null) {  
            //Verificar se já existe um carrinho do usuário
            carrinho = await database_carrinhos.findOne({where: {usuarios_id: user_id}});

            if(carrinho != null) { //Zerar o carrinho, já que não tem itens
                carrinho.num_produtos = 0;
                carrinho.total = 0;
                carrinho.sub_total = 0;

                carrinho.save();
            }
            else { //Criar carrinho novo
                carrinho = await database_carrinhos.create({
                    usuarios_id: user_id,
                    num_produtos: 0,
                    total: 0,
                    subtotal: 0
                });
            }

            carrinho.itens_carrinho = [];
        }
        
        //Transformar o ID do item no produto em si
        for(index in carrinho.itens_carrinho) {
            const produto = carrinho.itens_carrinho[index].produtos_id;
            
            const prodQuery = await database_prods.findByPk(produto);
            carrinho.itens_carrinho[index] = {
                nome: prodQuery.nome,
                descricao: prodQuery.descricao,
                preco: prodQuery.preco,
                estoque: prodQuery.estoque,
                disponivel: prodQuery.disponivel
            };
        }
        
        //Buscar
        res.status(200).json({
            success: true,
            num_produtos: carrinho.num_produtos,
            total: carrinho.total,
            subtotal: carrinho.subtotal,
            itens_carrinho: carrinho.itens_carrinho
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
};

module.exports = GetCarrinho;