const { json } = require('express');
const {Validator} = require('jsonschema');

//Validação de JSON - JSONSCHEMA
const v = new Validator();

//Controller das rotas de usuários
class UserController {
    cadastro(req, res) {

        //JSON que a rota espera receber
        const schema = {
            type: 'object',
            properties: {
                email: {type: 'string'},
                password: {type: 'string'}
            },
            required: ['email', 'password']
        }
        
        const data = req.body;

        if(v.validate(data, schema).valid) {
            
        }
        else {
            res.status(406).json({
                success: false,
                http_response: 406,
                message: "Objeto de entrada inválido",
                json_expected: {
                    email: 'string',
                    password: 'string'
                }
            });
        }
    }
}

module.exports = new UserController();