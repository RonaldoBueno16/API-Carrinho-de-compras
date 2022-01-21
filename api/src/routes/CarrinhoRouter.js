const express = require('express');
var route = express.Router();
require('dotenv').config();

const middleware = require('../middlewares/CarrinhoMiddlewares');
const controller = require('../controllers/CarrinhoController');

route.get(`${process.env.rotas}/carrinho/`, middleware, controller.getCarrinho); //Trazer o carrinho do usuário
route.post(`${process.env.rotas}/carrinho/inserir_item/`, middleware, controller.insertItem); //Adicionar item ao carrinho
route.delete(`${process.env.rotas}/carrinho/limpar/`, middleware, controller.limparCarrinho);
route.put(`${process.env.rotas}/carrinho/atualizar/`, middleware, controller.atualizarCarrinho);

module.exports = route;