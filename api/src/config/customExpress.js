const fs = require('fs');
const express = require('express');
const cors = require('cors');
// const routes = require('../routes/routes');
const jwt = require('jsonwebtoken');

console.log("Cheogu aq");

const routePath = './src/routes/';

class App {
    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use((req, res, next) => {

            this.app.use(cors());
            next();
        })
    }
    
    routes() {
        fs.readdirSync(routePath).forEach((file) => {
            this.app.use(require(`../routes/${file}`));
        })
    }
}

module.exports = new App().app;