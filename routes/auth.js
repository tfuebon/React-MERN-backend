/*
    Rutas de usuarios / auth
    host + /api/auth
*/

const express = require('express')
const { check } = require('express-validator')
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth')
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')
const router = express.Router()

// Se puede pasar un middleware a todas las rutas, algo que se ejecuta antes de que se ejecute la ruta
router.post(
    '/new', 
    [ // Array de middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 carácteres').isLength({min: 6}),
        validarCampos // Este middleware permite ejecutar el middleware de validación de campos
    ],
    crearUsuario
)

router.post(
    '/',
    [ // Array de middlewares
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password obligatorio').not().isEmpty(),
        validarCampos
    ],
    loginUsuario
)

router.get('/renew', validarJWT, revalidarToken)

module.exports = router