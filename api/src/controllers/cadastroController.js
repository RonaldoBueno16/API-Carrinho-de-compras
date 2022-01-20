const {Validator} = require('jsonschema');

//Database
const database = require('../models').usuarios;

//Validação de JSON - JSONSCHEMA
const v = new Validator();

//Web Token
const jwt = require('jsonwebtoken');

const cadastro = async (req, res) => {
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
            //Verificação de email duplicado
            const check_email = await database.findOne({
                where: {email: data.email}
            });
            
            if(check_email == null) {
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
            else {
                res.status(406).json({
                    success: false,
                    http_response: 406,
                    message: 'Endereço de email já existente no banco de dados!'
                })
            }
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
};

module.exports = cadastro;