const app = require('./src/config/customExpress')
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ligado na porta: ${PORT}`);
})