const express = require('express');

const Controller = require('../controllers/Controller');

var router = express.Router();

router.post("/api/v1/post/cadastro", Controller.cadastro); //Cadastrar usuário no banco

module.exports = router;