const jwt = require('jsonwebtoken');

const middlewares = (req, res, next) => {
    const authorization = req.headers.authorization;
    
    if(!authorization) return res.status(403).json({success: false, auth: false, message: "Token não informado"});

    const bearer = authorization.split(" ")[0] == "Bearer";
    
    if(!bearer) return res.status(403).json({success: false, auth: false, message: "Token inválido"});

    const token = authorization.split(" ")[1];
    
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if(err) {
            return res.status(403).json({
                success: false,
                auth: false,
                message: "Usuário não autenticado, logue novamente!"
            })
        }
        
        req.user_id = decoded.id;
        req.token = token;
        return next();
    })
};

module.exports = middlewares;