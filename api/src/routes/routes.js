const express = require('express');

const UserController = require('../controllers/UserController');

var router = express.Router();

//Rotas de usuários
router.post("/api/v1/post/cadastro", UserController.cadastro); //Cadastrar usuário no banco

//Rotas do carrinho

module.exports = router;