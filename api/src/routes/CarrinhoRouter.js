const express = require('express');
var route = express.Router();
require('dotenv').config();

const middleware = require('../middlewares/CarrinhoMiddlewares');
const controller = require('../controllers/CarrinhoController');

route.get(`/api/v1/carrinho/`, middleware, controller.getCarrinho); //Trazer o carrinho do usuário
route.post(`/api/v1/carrinho/inserir_item/`, middleware, controller.insertItem); //Adicionar item ao carrinho
route.delete(`/api/v1/carrinho/limpar/`, middleware, controller.limparCarrinho);
route.put(`/api/v1/carrinho/atualizar/`, middleware, controller.atualizarCarrinho);

module.exports = route;