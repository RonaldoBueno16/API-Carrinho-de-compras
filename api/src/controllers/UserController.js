const { json } = require('express');
const {Validator} = require('jsonschema');

//Database
const database = require('../models').usuarios;

//Validação de JSON - JSONSCHEMA
const v = new Validator();

//Controller das rotas de usuários
class UserController {
    static async cadastro(req, res) {

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
            try {
                const response = await database.create({
                    email: data.email,
                    password: data.password,
                    createdAt: new Date(),
                    updateAt: new Date()
                });

                return res.status(200).json({
                    success: true,
                    http_response: 200,
                    message: 'Usuário cadastrado com sucesso!',
                    userid: response.id
                })
            }
            catch(e) {
                return res.status(500).json({
                    success: false,
                    http_response: 500,
                    message: 'Não foi possível cadastrar o usuário',
                    error: e.message
                })
            }
        }
        else {
            return res.status(406).json({
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

module.exports = UserController;