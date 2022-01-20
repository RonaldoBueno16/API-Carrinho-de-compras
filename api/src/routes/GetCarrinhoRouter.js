const express = require('express');
var route = express.Router();

const controller = require('../controllers/GetCarrinhoController');

route.get("/api/v1/carrinho/get/", controller); //Trazer o carrinho do usuário

module.exports = route;