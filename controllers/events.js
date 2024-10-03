const { response } = require('express');
const Evento = require('../models/Evento');
//const { check } = require('express-validator');
//const { validarCampos } = require('../middlewares/validar-campos');
//const { validarJWT } = require('../middlewares/validar-jwt');
//const { isDate } = require('../helpers/isDate');

const getEventos = async(req, res = response) => {

    const eventos = await Evento.find()
        .populate('user', 'name email');

    try {

        res.status(200).json({
            ok: true,
            eventos
            //msg: 'obtenerEventos'
        })

    } catch (error) {

        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

    }
    
}

const crearEvento = async(req, res = response) => {

    // verificar que tiene el evento
    //console.log(req.body)

    const evento = new Evento(req.body);

    try {

        evento.user = req.uid
        const eventoGuardado = await evento.save();

        res.status(200).json({
            ok: true,
            evento: eventoGuardado
            //msg: 'crearEvento'
        })

    } catch (error) {

        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
        
    }

}

const actualizarEvento = async(req, res = response) => {

    const evnetoId = req.params.id

    try {

        const evento = await Evento.findById( evnetoId );
        //const evento = await Evento.findByIdAndUpdate( evnetoId, req.body, { new: true } );

        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontro el evento'
            })
        }

        const uid = req.uid

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permiso para editar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( evnetoId, nuevoEvento, { new: true } );

        res.status(200).json({
            ok: true,
            evnetoId,
            evento: eventoActualizado
            //msg: 'actualizarEvento'
        })

    } catch (error) {

        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
        
    }

}

const eliminarEvento = async(req, res = response) => {

    const evnetoId = req.params.id

    try {

        const evento = await Evento.findById( evnetoId );
        //const evento = await Evento.findByIdAndUpdate( evnetoId, req.body, { new: true } );

        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontro el evento'
            })
        }

        const uid = req.uid

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permiso para eliminar este evento'
            })
        }

        const eventoEliminado = await Evento.findByIdAndDelete( evnetoId );

        res.status(200).json({
            ok: true,
            eventoEliminado,
            //msg: 'eliminarEvento'
        })

    } catch (error) {

        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
        
    }
   
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}