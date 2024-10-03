const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {

    // Se pedirá el token en el header x-token

    const token = req.header('x-token');
    //console.log(token)

    if( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        })
    }

    try {
        
        const payload = jwt.verify( token, process.env.SECRET_JWT_SEED );
        //console.log(payload)
        req.uid = payload.uid;
        req.name = payload.name;
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        })
    }
}

module.exports = {
    validarJWT
}