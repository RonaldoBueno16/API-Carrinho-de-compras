const express = require('express');
var route = express.Router();
require('dotenv').config();

const middleware = require('../middlewares/CarrinhoMiddlewares');
const controller = require('../controllers/CarrinhoController');

route.get(`${process.env.rotas}/carrinho/`, middleware, controller.getCarrinho); //Trazer o carrinho do usuário
route.post(`${process.env.rotas}/carrinho/inserir_item/`, middleware, controller.insertItem); //Adicionar item ao carrinho
route.delete(`${process.env.rotas}/carrinho/remover_item/`, middleware, controller.removeItem);

module.exports = route;