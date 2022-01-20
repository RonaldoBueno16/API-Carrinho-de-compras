const {Validator} = require('jsonschema');

//Database
const database = require('../models').usuarios;

//Validação de JSON - JSONSCHEMA
const v = new Validator();

//Web Token
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
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
            const check_account = await database.findOne({where: {email: data.email, password: data.password}});
            
            if(check_account != null) {
                const token = jwt.sign({id: check_account.id}, process.env.SECRET, {
                    expiresIn: 1800 //Token válido por 30 minutos
                });

                check_account.token = token;
                await check_account.save();

                return res.status(200).json({
                    success: true,
                    http_response: 200,
                    message: "Usuário autenticado com sucesso!",
                    token: token
                });
            }
            else {
                return res.status(404).json({
                    success: false,
                    http_response: 404,
                    message: "Não foi possível encontrar uma conta com essas credenciais",
                    token: null
                });
            }
        }
        catch(e) {
            return res.status(500).json({
                success: false,
                http_response: 500,
                message: 'Não foi possível efetuar o login',
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

module.exports = login;