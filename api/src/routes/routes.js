const express = require('express');

const Controller = require('../controllers/Controller');

var router = express.Router();

router.get("/api/v1/get/produtos", Controller.listarprodutos);

module.exports = router;