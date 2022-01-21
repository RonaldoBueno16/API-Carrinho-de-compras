//Validar JSON
const {Validator} = require('jsonschema');
const v = new Validator();

//Database
const database = require('../models').usuarios;

//Web Token
const jwt = require('jsonwebtoken');

const schema = {
    type: 'object',
    properties: {
        email: {type: 'string'},
        password: {type: 'string'}
    },
    required: ['email', 'password']
}

class UserController {
    static async cadastro(req, res, next) {
        const data = req.body;

        const valid = v.validate(data, schema).valid;

        if(!valid) {
            return res.status(400).json({
                success: false,
                message: "Objeto de entrada inválido",
                json_expected: {
                    email: 'string',
                    password: 'string'
                }
            });
        }

        try {
            const response = await database.create({
                email: data.email,
                password: data.password,
                createdAt: new Date(),
                updateAt: new Date()
            });

            return res.status(200).json({
                success: true,
                message: 'Usuário cadastrado com sucesso!'
            });
        }
        catch(e) {
            return res.status(500).json({
                success: false,
                message: 'Não foi possível cadastrar o usuário',
                error: e.message
            })
        }
    }

    static async login(req, res, next) {
        const data = req.body;

        const valid = v.validate(data, schema).valid;

        if(!valid) {
            return res.status(400).json({
                success: false,
                message: "Objeto de entrada inválido",
                json_expected: {
                    email: 'string',
                    password: 'string'
                }
            });
        }

        try {
            const check_account = await database.findOne({where: {email: data.email, password: data.password}});

            if(check_account == null) {
                return res.status(403).json({
                    success: false,
                    auth: false,
                    message: "Não foi possível encontrar uma conta com essas credenciais",
                    token: null
                });
            }

            check_account.token = CreateToken(check_account.id);
            await check_account.save();

            return res.status(200).json({
                success: true,
                auth: true,
                message: "Usuário logado com sucesso!",
                token: check_account.token
            })
        }
        catch(e) {
            return res.status(403).json({
                success: false,
                message: "Objeto de entrada inválido",
                json_expected: {
                    email: 'string',
                    password: 'string'
                }
            });
        }
    }
}

function CreateToken(accountID) {
    const token = jwt.sign({id: accountID}, process.env.SECRET);

    return token;
}

module.exports = UserController;