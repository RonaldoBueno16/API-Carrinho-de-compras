const express = require('express');
var route = express.Router();
require('dotenv').config();

const controller = require('../controllers/UserController');

route.get('/', () => {
    console.log("oi");
})

route.post(`/api/v1/login`, controller.login); //Gerar o token para o usuário poder começar usar o carrinho
route.post(`/api/v1/cadastro`, controller.cadastro); //Cadastrar usuário no banco

module.exports = route;