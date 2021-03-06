/*
    Ruta: /api/usuarios
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getUsuarios, createUsuario, updateUsuario } = require('../controllers/usuario.controller');

const router = Router();


// Listar Usuarios
router.get( '/' , getUsuarios );
// Crear Usuario
/*
router.post( ruta, middleware, controlador)
router.post( ruta, 
    [ 
        varios, 
        middlewares 
    ],
    controlador
) 
*/
router.post( '/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ], 
    createUsuario 
);
router.put( '/:id', 
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('role', 'El rol es obligatorio').not().isEmpty()
        //validarCampos,
    ],
    updateUsuario );


module.exports = router;