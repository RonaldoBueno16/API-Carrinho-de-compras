const expres = require('express');
const mysql = require('mysql');

const app = expres();

const PORT = 3000;
const HOST = '0.0.0.0';

app.get('/', (req, res) => {
    res.send('oiasasii');
})

app.listen(PORT, HOST);