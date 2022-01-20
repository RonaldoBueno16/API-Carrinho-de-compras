const express = require('express');
var route = express.Router();

const listprodsController = require('../controllers/listprodsController');

route.get("/api/v1/prods/get/all", listprodsController); //Gerar o token para o usuário poder começar usar o carrinho

module.exports = route;