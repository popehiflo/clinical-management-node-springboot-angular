const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario.model');


const getUsuarios = async(req, res) => {

    // Listar solo campos que me interesan
    const usuarios = await Usuario.find({}, 'nombre email role google');

    res.json({
        ok: true,
        usuarios
    });

}

const createUsuario = async(req, res = response) => {

    const { email, password } = req.body;
    try {
        const existeEmail = await Usuario.findOne({email});
        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }
        const usuario = new Usuario(req.body);
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );
        // Guardar Usuario
        await usuario.save();
        res.json({
            ok: true,
            usuario
        });
    } catch (error) {
        console.group('Error Guardar Usuario');
        console.log(error);
        console.groupEnd();
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Ver logs'
        });
    }
}

const updateUsuario = async (req, res = response) => {

    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            })
        }
        
        /* --Falta validar token y comprobar si es usuario correcto*/

        // Actualizar usuario
        const campos = req.body;


        if (usuarioDB.email === req.body.email) {
            delete campos.email;
        } else {
            const existeEmail = await Usuario.findOne({email: req.body.email});
            if ( existeEmail ){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        delete campos.password;
        delete campos.google;

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, {new: true});

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

module.exports = {
    getUsuarios,
    createUsuario,
    updateUsuario
}