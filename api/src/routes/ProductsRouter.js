const express = require('express');
var route = express.Router();
require('dotenv').config();

const controller = require('../controllers/ProductsController');

route.get(`${process.env.rotas}/produtos`, controller); //Trazer todos os produtos da loja

module.exports = route;