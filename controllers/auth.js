const express = require('express')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuario')
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async(req, res = express.response) => {
    
    //console.log(req.body)
    const { name, email, password } = req.body

    //// Validaciones
    //if( name.length < 5 ) {
    //    return res.status(400).json({
    //        ok: false,
    //        msg: 'Por favor ingrese todos los campos'
    //    })
    //}

    //// Manejo de errores
    //const errors = validationResult(req)
    ////console.log(errors)
    //
    //if( !errors.isEmpty() ) {
    //    return res.status(400).json({
    //        ok: false,
    //        errors: errors.mapped()
    //    })
    //}

    try {

        let usuario = await Usuario.findOne({ email })
        console.log(usuario)

        if( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario ya existe con ese correo'
            })
        }

        usuario = new Usuario( req.body )

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync()
        usuario.password = bcrypt.hashSync( password, salt )

        await usuario.save() // Guarda en la base de datos

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name )

        res.status(201).json({
            ok: true,
            //msg: 'register',
            uid: usuario.id,
            name: usuario.name,
            token
            //user: req.body,
            //name,
            //email,
            //password
        })
        
    } catch (error) {

        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs',
        })
        
    }

}

const loginUsuario = async(req, res = express.response) => {

    const { email, password } = req.body

    try {

        const usuario = await Usuario.findOne({ email })

        if( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            })
        }

        const validPassword = bcrypt.compareSync( password, usuario.password )

        if( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            })
        }

        const token = await generarJWT( usuario.id, usuario.name )

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
            //msg: 'login',
            //email,
            //password
        })


    } catch (error) {

        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })

    }
}

const revalidarToken = async(req, res = express.response) => {

    const uid = req.uid
    const name = req.name
    
    try {

        // Generar JWT y devolverlo en esta petición
        const token = await generarJWT( uid, name )

        res.json({
            ok: true,
            msg: 'renew',
            //uid,
            //name,
            token
        })

    } catch (error) {
        
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })

    }
    
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}