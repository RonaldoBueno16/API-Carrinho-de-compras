const express = require('express');
var route = express.Router();

const cadastroController = require('../controllers/cadastroController');

route.post("/api/v1/post/cadastro", cadastroController); //Cadastrar usuário no banco

module.exports = route;