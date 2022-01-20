const express = require('express');

const UserController = require('../controllers/UserController');

var router = express.Router();

//Rotas de usuários
router.post("/api/v1/post/cadastro", UserController.cadastro); //Cadastrar usuário no banco
router.post("/api/v1/post/login", UserController.login); //Gerar o token para o usuário poder começar usar o carrinho

//Rotas do carrinho

module.exports = router;