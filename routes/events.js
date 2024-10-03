/*
    Rutas de eventos / 
    host + /api/events
*/

const { Router } = require('express');
const router = Router();
const { validarJWT } = require('../middlewares/validar-jwt');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');

// Si se va a usar el middleware en todas las rutas con la siguiente linea
// de codigo se puede decir que antes de ejecutar cada ruta, se va a ejecutar el middleware

router.use( validarJWT );

router.get('/', /*validarJWT,*/ getEventos)

router.post(
    '/', 
    [
        /*validarJWT,*/ 
        check('title', 'El title es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de finalizaciÃ³n es obligatoria').custom( isDate ),
        validarCampos
    ],
    crearEvento
)

router.put(
    '/:id', 
    [
        /*validarJWT,*/
        check('title', 'El title es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de finalizaciÃ³n es obligatoria').custom( isDate ),
        validarCampos
    ],
    actualizarEvento
)

router.delete('/:id', /*validarJWT,*/ eliminarEvento)


module.exports = router