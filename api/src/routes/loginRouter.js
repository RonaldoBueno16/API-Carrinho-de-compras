const express = require('express');
var route = express.Router();

const loginController = require('../controllers/loginController');

route.post("/api/v1/post/login", loginController); //Gerar o token para o usuário poder começar usar o carrinho

module.exports = route;