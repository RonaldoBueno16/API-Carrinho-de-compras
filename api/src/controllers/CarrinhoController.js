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

class CarrinhoController {
    static async getCarrinho(req, res, next) {
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
            const carrinho = await CarregarCarrinho(user_id);
            
            //Buscar
            res.status(200).json({
                success: true,
                num_produtos: carrinho.num_produtos,
                carrinho_id: carrinho.id,
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
    }

    static async insertItem(req, res, next) {
        const user_id = req.user_id;

        const schema = {
            type: 'object',
            properties: {
                carrinho_id: {type: 'integer'},
                produtos: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            produto_id: {type: "integer"},
                            quantidade: {type: "integer"}
                        },
                        required: ['produto_id', 'quantidade']
                    }
                }
            },
            required: ['carrinho_id', 'produtos']
        }

        const data = req.body;
        
        if(!v.validate(data, schema).valid) {
            return res.status(400).json({
                success: false,
                message: "Objeto de entrada inválido",
                json_expected: {
                    carrinho_id: 'ID do carrinho',
                    produtos: [{
                        produto_id: 'ID do produto',
                        quantidade: 'Quantidade do produto'
                    }]
                }
            });
        }
        
        //Inicio das validações no banco
        try {
            //Se o carrinho é nulo || Se o carrinho pertence ao usuário 
            let check = await database_carrinhos.findByPk(data.carrinho_id);
            if(check == null) {
                return res.status(404).json({
                    success: false,
                    message: "Carrinho inválido!"
                })
            }
            if(check.usuarios_id != user_id) {
                return res.status(404).json({
                    success: false,
                    message: "Esse carrinho não pertence ao seu usuário!"
                });
            }
    
            //Verificar produtos
            if(!data.produtos.length) { //Caso o usuário passe uma array de produtos vazia
                return res.status(403).json({
                    success: false,
                    message: "Nenhum item para ser adicionado"
                });
            }
            const errors = [];
            const check_duplicados = [];
            for(let idx in data.produtos) { //Verificar todos os produtos informados
                const produto = data.produtos[idx].produto_id;
                const quantidade = data.produtos[idx].quantidade;
                
                check = await database_prods.findByPk(produto);
                if(check == null) { //Verificar se o produto existe no banco
                    errors.push(`O produto ID: ${produto} não existe no estoque da loja!`)
                }
                if(check != null && quantidade > check.estoque) { //Verificar se tem no estoque
                    errors.push(`O produto ID: ${produto} só tem ${check.estoque} em seu estoque disponível`);
                }
                if(check_duplicados.includes(produto)) { //Verificar se o usuário mandou produtos duplicados
                    errors.push(`O produto ID: ${produto} está duplicado no carrinho`);
                }
                check_duplicados.push(produto);

                check = await database_itens_carrinho.findOne({where: {
                    carrinhos_id: data.carrinho_id,
                    produtos_id: produto
                }});
                if(check != null) {
                    errors.push(`O produto ID: ${produto} já está adicionado ao seu carrinho!`);
                }
            }
            if(errors.length) {
                return res.status(403).json({
                    success: false,
                    errors: errors
                })
            }
            
            for(let idx in data.produtos) { //Inserir itens ao carrinho
                const insert = await database_itens_carrinho.create({
                    carrinhos_id: data.carrinho_id,
                    produtos_id: data.produtos[idx].produto_id,
                    quantidade: data.produtos[idx].quantidade,
                })
            }

            //Carregar o carrinho
            const carrinho = await CarregarCarrinho(user_id);
            
            //Retornar o carrinho completo com os novos itens
            res.status(200).json({
                success: true,
                message: "Produtos inseridos com sucesso!",
                num_produtos: carrinho.num_produtos,
                carrinho_id: carrinho.id,
                total: carrinho.total,
                subtotal: carrinho.subtotal,
                itens_carrinho: carrinho.itens_carrinho
            });
        }
        catch (e) {
            return res.status(500).json({
                success: false,
                message: "Não foi possível inserir itens ao carrinho do usuário",
                error: e.message
            })
        }
    }
}

async function CarregarCarrinho(user_id) {
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

    let valor_total = 0;
    
    //Transformar o ID do item no produto em si
    for(let idx in carrinho.itens_carrinho) {
        const produto = carrinho.itens_carrinho[idx].produtos_id;
        const prodQuery = await database_prods.findByPk(produto);

        //Validar se tem no estoque a quantidade que ele deseja comprar
        const estoque = prodQuery.estoque;
        const quantidade = carrinho.itens_carrinho[idx].quantidade;
        let observacao = null;

        //Somar valor
        valor_total += prodQuery.preco;
        
        carrinho.itens_carrinho[idx] = {
            nome: prodQuery.nome,
            descricao: prodQuery.descricao,
            preco: prodQuery.preco,
            quantidade: carrinho.itens_carrinho[idx].quantidade,
            disponivel: prodQuery.disponivel,
            observacao: (quantidade > estoque) ? (`Quantidade insuficiente no estoque: ${estoque}`) : null
        };
    }

    carrinho.num_produtos = carrinho.itens_carrinho.length;
    carrinho.total = valor_total;
    carrinho.subtotal = valor_total;
    carrinho.save();

    return carrinho;
}

module.exports = CarrinhoController;