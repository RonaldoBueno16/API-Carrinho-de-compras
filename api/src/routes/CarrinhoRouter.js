const express = require('express');
var route = express.Router();
require('dotenv').config();

const middleware = require('../middlewares/CarrinhoMiddlewares');
const controller = require('../controllers/CarrinhoController');

route.get(`${process.env.rotas}/carrinho`, middleware, controller); //Trazer o carrinho do usuário

module.exports = route;