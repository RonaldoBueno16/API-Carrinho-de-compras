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
const database_cupons = require('../models').cupons;

class CarrinhoController {
    static async getCarrinho(req, res, next) {
        const user_id = req.user_id;
        const token = req.token;
        
        //Comparar token com o do banco de dados para evitar logins simuntâneos
        try {
            const usuario = await database_usuarios.findByPk(user_id);

            if(usuario == null) {
                return res.status(401).json({
                    success: false,
                    auth: false,
                    errortype: {
                        id: 4,
                        name: 'AUTH_FAILURE'
                    },
                    message: "Não foi possível localizar o usuário"
                });
            }

            if(usuario.token != token) {
                return res.status(401).json({
                    success: false,
                    auth: false,
                    errortype: {
                        id: 4,
                        name: 'AUTH_FAILURE'
                    },
                    message: "Usuário não autenticado"
                })
            }
        }
        catch(e) {
            return res.status(500).json({
                success: false,
                message: "Não foi possível trazer o carrinho do usuário",
                errortype: {
                    id: 2,
                    name: 'SERVER_NOT_RESPOND'
                },
                error: e.message
            })
        }
        
        //Trazer o carrinho do usuário
        try {
            const carrinho = await CarregarCarrinho(user_id);
            
            //Buscar
            return res.status(200).json({
                success: true,
                cupom: carrinho.cupomname,
                cupom_percent: carrinho.cupompercent,
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
                errortype: {
                    id: 2,
                    name: 'SERVER_NOT_RESPOND'
                },
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
            return res.status(403).json({
                success: false,
                message: "JSON inválido",
                errortype: {
                    id: 1,
                    name: 'INVALID_JSON'
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
                    errortype: {
                        id: 3,
                        name: 'NOTFOUND'
                    },
                    message: "Carrinho inválido!"
                })
            }
            if(check.usuarios_id != user_id) {
                return res.status(404).json({
                    success: false,
                    errortype: {
                        id: 3,
                        name: 'NOTFOUND'
                    },
                    message: "Esse carrinho não pertence ao seu usuário!"
                });
            }
    
            //Verificar produtos
            if(!data.produtos.length) { //Caso o usuário passe uma array de produtos vazia
                return res.status(403).json({
                    success: false,
                    message: "JSON inválido - Informe uma array de produtos válida",
                    errortype: {
                        id: 1,
                        name: 'INVALID_JSON'
                    }
                });
            }
            const errors = [];
            const check_duplicados = [];
            for(let idx in data.produtos) { //Verificar todos os produtos informados
                const produto = data.produtos[idx].produto_id;
                const quantidade = data.produtos[idx].quantidade;
                
                check = await database_prods.findByPk(produto);
                if(check == null) { //Verificar se o produto existe no banco
                    errors.push({
                        id: 6,
                        name: 'NOT_EXISTS_IN_STOCK',
                        description: `O produto ID: ${produto} não existe no estoque da loja!`
                    });
                }
                if(check != null && quantidade > check.estoque) { //Verificar se tem no estoque
                    errors.push({
                        id: 7,
                        name: 'QUANTIFY_OF_STOCK',
                        description: `O produto ID: ${produto} só tem ${check.estoque} em seu estoque disponível`
                    })
                }
                if(check_duplicados.includes(produto)) { //Verificar se o usuário mandou produtos duplicados
                    errors.push({
                        id: 8,
                        name: 'PRODUCT_DUPLICATED',
                        description: `O produto ID: ${produto} está duplicado no carrinho`
                    })
                }
                check_duplicados.push(produto);

                check = await database_itens_carrinho.findOne({where: {
                    carrinhos_id: data.carrinho_id,
                    produtos_id: produto
                }});
                if(check != null) {
                    errors.push({
                        id: 8,
                        name: 'PRODUCT_DUPLICATED',
                        description: `O produto ID: ${produto} já está adicionado ao seu carrinho!`
                    })
                }
            }
            if(errors.length) {
                return res.status(403).json({
                    success: false,
                    message: 'Multiplos erros',
                    errortype: {
                        id: 5,
                        name: 'PRODUCT_ERRORS'
                    },
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
            return res.status(200).json({
                success: true,
                message: "Produtos inseridos com sucesso!",
                cupom: carrinho.cupomname,
                cupom_percent: carrinho.cupompercent,
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
                errortype: {
                    id: 2,
                    name: 'SERVER_NOT_RESPOND'
                },
                error: e.message
            })
        }
    }

    static async limparCarrinho(req, res, next) {
        const user_id = req.user_id;

        const schema = {
            type: 'object',
            properties: {
                carrinho_id: {type: 'integer'}
            },
            required: ['carrinho_id']
        };

        const data = req.body;
        
        //Verificar se o JSON informado é o que se espera
        if(!v.validate(data, schema).valid) {
            return res.status(403).json({
                success: false,
                message: "JSON inválido",
                errortype: {
                    id: 1,
                    name: 'INVALID_JSON'
                }
            });
        }

        //Verificar se o carrinho é do usuário autenticado
        try {
            //Se o carrinho é nulo || Se o carrinho pertence ao usuário 
            let check = await database_carrinhos.findByPk(data.carrinho_id);
            if(check == null) {
                return res.status(404).json({
                    success: false,
                    errortype: {
                        id: 3,
                        name: 'NOTFOUND'
                    },
                    message: "Carrinho inválido!"
                })
            }
            if(check.usuarios_id != user_id) {
                return res.status(404).json({
                    success: false,
                    errortype: {
                        id: 3,
                        name: 'NOTFOUND'
                    },
                    message: "Esse carrinho não pertence ao seu usuário!"
                });
            }

            //Verifica a quantidade de itens no carrinho
            check = await database_itens_carrinho.count({where: {carrinhos_id: data.carrinho_id}});
            if(check == 0) {
                return res.status(404).json({
                    success: false,
                    errortype: {
                        id: 3,
                        name: 'NOTFOUND'
                    },
                    message: "O carrinho já está vazio!"
                });
            }

            //Deletar todos os itens do carrinho
            check = await database_itens_carrinho.destroy({where: {carrinhos_id: data.carrinho_id}});
            const itens_deletados = check;

            //Retornar o carrinho novo do cliente
            const carrinho = await CarregarCarrinho(user_id);
            
            //Retornar o carrinho completo com os novos itens
            return res.status(200).json({
                success: true,
                message: "Carrinho limpo com sucesso!",
                cupom: carrinho.cupomname,
                cupom_percent: carrinho.cupompercent,
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
                message: "Não foi possível limpar o carrinho do usuário",
                errortype: {
                    id: 2,
                    name: 'SERVER_NOT_RESPOND'
                },
                error: e.message
            });
        }

    }

    static async atualizarCarrinho(req, res, next) {
        const user_id = req.user_id;

        const schema = {
            type: 'object',
            properties: {
                carrinho_id: {type: 'integer'}, //Obrigatório passar o ID do carrinho
                cupom: {type: 'string'}, //Parâmetro opcional
                produtos: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            produto_id: {type: 'integer'},
                            quantidade: {type: 'integer'}
                        },
                        required: ['produto_id']
                    }
                }
            },
            required: ['carrinho_id']
        }

        //Elementos aceitos para atualizar os produtos
        const schemaProdutos = [
            'quantidade'
        ]

        const data = req.body;
        
        //Verificar se o JSON informado é o que se espera
        if(!v.validate(data, schema).valid) {
            return res.status(403).json({
                success: false,
                message: "JSON inválido",
                errortype: {
                    id: 1,
                    name: 'INVALID_JSON'
                }
            });
        }

        //Iniciando validações com o banco de dados
        try {
            //Se o carrinho é nulo || Se o carrinho pertence ao usuário 
            let check = await database_carrinhos.findByPk(data.carrinho_id);
            if(check == null) {
                return res.status(404).json({
                    success: false,
                    errortype: {
                        id: 3,
                        name: 'NOTFOUND'
                    },
                    message: "Carrinho inválido!"
                })
            }
            if(check.usuarios_id != user_id) {
                return res.status(404).json({
                    success: false,
                    errortype: {
                        id: 3,
                        name: 'NOTFOUND'
                    },
                    message: "Esse carrinho não pertence ao seu usuário!"
                });
            }

            const errors = [];
            let cupom;
            
            //Consulta nos itens do carrinho do usuário para uso posterior
            const itens_carrinho = await database_itens_carrinho.findAll({where: {carrinhos_id: data.carrinho_id}});
            
            //Validação de cupom (OPCIONAL)
            if(data.cupom != undefined && data.cupom != "") {
                //Buscar cupom
                check = await database_cupons.findOne({where: {codigo: data.cupom}});
                if(check == null) {
                    errors.push({
                        id: 9,
                        name: 'INVALID_CUPOM',
                        description: 'Cupom inválido'
                    });
                }

                //Salvar cupom para adicionar ao carrinho após outras validações
                cupom = check == null ? (null) : (check.id);
            }

            //Validação na array dos produtos
            if(data.produtos != undefined) {
                const produtos = data.produtos;

                //Verificar se o usuário informou uma array de objetos de produtos
                if(produtos.length == 0) {
                    if(!data.produtos.length) { //Caso o usuário passe uma array de produtos vazia
                        return res.status(403).json({
                            success: false,
                            message: "JSON inválido - Informe uma array de produtos válida",
                            errortype: {
                                id: 1,
                                name: 'INVALID_JSON'
                            }
                        });
                    }
                }

                //Verificar se tem algo no carrinho do usuário
                if(itens_carrinho.length == 0) {
                    return res.status(404).json({
                        success: false,
                        errortype: {
                            id: 3,
                            name: 'NOTFOUND'
                        },
                        message: 'O carrinho do usuário está vazio'
                    })
                }
                for(let idx in produtos) {
                    const produto = produtos[idx];

                    //Caso não tenha nenhum elemento para o produto
                    if(Object.keys(produto).length == 0) {
                        errors.push({
                            id: 1,
                            name: 'INVALID_JSON',
                            description: `Objeto de produto vazio - Array ID: ${idx}`
                        });
                        continue;
                    }
                    for(let idkey in Object.keys(produto)) {
                        if(Object.keys(produto)[idkey] == 'produto_id') continue;
                        if(!Object.keys(produto)[idkey].includes(schemaProdutos)) {
                            errors.push({
                                id: 10,
                                name: 'ELEMENT_REFUSED',
                                description: `O elemento ${Object.keys(produto)[idkey]} não é aceito para atualização dos produtos`
                            });
                            continue;
                        }
                    }

                    //Verificar se o produto está no carrinho do cliente
                    let encontrou = false;
                    for(let idc in itens_carrinho) {
                        const item = itens_carrinho[idc];
                        if(produto.produto_id == item.produtos_id) {
                            encontrou = true;
                            break;
                        }
                    }
                    if(!encontrou) {
                        errors.push({
                            id: 11,
                            name: 'PRODUCT_NOT_BELONG_USER',
                            description: `O produto ID ${produto.produto_id} não pertence ao carrinho do usuário`
                        });
                    }

                    //Verificar se a nova quantidade condiz com o estoque
                    const estoque = await database_prods.findByPk(produto.produto_id);
                    if(produto.quantidade > estoque.estoque) {
                        errors.push({
                            id: 5,
                            name: 'QUANTIFY_OF_STOCK',
                            description: `O produto ID ${produto.produto_id} só tem ${estoque.estoque} unidades no estoque`
                        });
                    }
                }
            }
            
            if(errors.length) {
                return res.status(403).json({
                    success: false,
                    message: "Multiplos erros",
                    errortype: {
                        id: 5,
                        name: 'PRODUCT_ERRORS'
                    },
                    errors: errors
                })
            }

            //Setar cupom ao carrinho
            if(cupom != null) {
                check = await database_carrinhos.findByPk(data.carrinho_id);

                check.cupom = cupom;
                await check.save();
            }

            //Remover cupom do carrinho
            if(data.cupom == "") {
                check = await database_carrinhos.findByPk(data.carrinho_id);

                check.cupom = null;
                await check.save();
            }

            //Atualizar os produtos no carrinho
            if(data.produtos != undefined) {
                const produtos = data.produtos;
                
                for(let idx in produtos) {
                    const produto = produtos[idx];
                    const keys = Object.keys(produto);
                    
                    for(let keyx in keys) {
                        const key = keys[keyx];
                        if(key == 'produto_id') continue;

                        switch(key) {
                            case 'quantidade': { //Atualizar a quantidade de item no carrinho (Remover caso a quantidade zere)
                                let idc;
                                for(let x in itens_carrinho) { //Uso da matriz para remover o item, evitando consulta ao banco para buscar ao item
                                    if(itens_carrinho[x].produtos_id == produto.produto_id) {
                                        idc = x;
                                        break;
                                    }
                                }
                                
                                if(produto.quantidade == 0) { //Remover item do carrinho
                                    await itens_carrinho[idc].destroy();
                                    break;
                                }
                                
                                //Atualizar quantidade de item no carrinho
                                itens_carrinho[idc].quantidade = produto.quantidade;
                                await itens_carrinho[idc].save();
                                break;
                            }
                        }
                    }
                }
            }
            
            //Carregar o carrinho
            const carrinho = await CarregarCarrinho(user_id);
            
            //Retornar o carrinho completo com os novos itens
            return res.status(200).json({
                success: true,
                message: "Carrinho atualizado com sucesso!",
                cupom: carrinho.cupomname,
                cupom_percent: carrinho.cupompercent,
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
                message: "Não foi possível limpar o carrinho do usuário",
                error: e.message
            });
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
        valor_total += prodQuery.preco*carrinho.itens_carrinho[idx].quantidade;
        
        carrinho.itens_carrinho[idx] = {
            produto_id: prodQuery.id,
            nome: prodQuery.nome,
            descricao: prodQuery.descricao,
            preco: prodQuery.preco,
            quantidade: carrinho.itens_carrinho[idx].quantidade,
            disponivel: prodQuery.disponivel,
            observacao: (quantidade > estoque) ? (`Quantidade insuficiente no estoque: ${estoque}`) : null
        };
    }

    carrinho.num_produtos = carrinho.itens_carrinho.length;

    //Aplicar cupom
    let sub_total = valor_total;
    carrinho.cupomname = null;
    carrinho.cupompercent = null;
    if(carrinho.cupom != null) {
        const cupom = await database_cupons.findByPk(carrinho.cupom);
        if(cupom == null) { //Cupom desativado
            carrinho.cupom = null;
        }
        else {
            sub_total -= valor_total*cupom.desconto;
            carrinho.cupomname = cupom.codigo;
            carrinho.cupompercent = `${cupom.desconto*100}%`;
        }
    }
    
    carrinho.total = valor_total;
    carrinho.subtotal = sub_total;
    carrinho.save();
    return carrinho;
}

module.exports = CarrinhoController;