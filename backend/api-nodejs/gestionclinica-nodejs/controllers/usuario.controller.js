const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario.model');
const { generarJWT } = require('../helpers/jwt');


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
        // Generar token - JWT para nuevo usuario
        const token = await generarJWT(usuario.id);
        res.json({
            ok: true,
            usuario,
            token
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
        
        /* --ToDo: validar token y comprobar si es usuario correcto*/

        // Actualizar usuario
        const {password, google, email, ...campos} = req.body;


        if (usuarioDB.email !== email) {
            const existeEmail = await Usuario.findOne({email});
            if ( existeEmail ){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        campos.email = email;
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

const deleteUsuario = async(req, res = response ) => {

    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete( uid );
        
        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el administrador'
        });
    }
}

module.exports = {
    getUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario
}