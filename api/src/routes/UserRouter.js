const express = require('express');
var route = express.Router();
require('dotenv').config();

const controller = require('../controllers/UserController');

route.post(`${process.env.rotas}/login`, controller.login); //Gerar o token para o usuário poder começar usar o carrinho
route.post(`${process.env.rotas}/cadastro`, controller.cadastro); //Cadastrar usuário no banco

module.exports = route;