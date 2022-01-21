const express = require('express');
var route = express.Router();
require('dotenv').config();

const controller = require('../controllers/ProductsController');

route.get(`/api/v1/produtos`, controller); //Trazer todos os produtos da loja

module.exports = route;