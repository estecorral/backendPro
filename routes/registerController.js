'use strict';
const Usuario = require('../models/Usuario');
const Anuncio = require('../models/Anuncio');

class RegisterController {
    //POST new user data
    async postRegUser(req, res, next) {
        try{
            let data = req.body;
            const password = await Usuario.hashPassword(data.password);;
            data.password = password;
            const usuario = new Usuario(data);
            const usuarioRegMail = await Usuario.findOne({ email: data.email });
            const usuarioRegUsername = await Usuario.findOne({ username: data.username});
            if (usuarioRegUsername || usuarioRegMail) {
                await res.json({success: false, error: 'usuario ya registrado'});
                return;
            }
                const regUser = await usuario.save();
                await res.json({ success: true, result: regUser });
        }catch (e) {
            console.log('ERROR: ', e);
            next(e);
        }
    }

    //DELETE delete user
    async deleteUser(req, res, next) {
        try {
            const userId = req.param('id');
            const borrado = await Usuario.deleteOne({_id: userId});
            res.json({ success: true, result: borrado });
        } catch (e) {
            console.log('ERROR: ', e);
            next(e);
        }
    }

    //PUT actualizar datos usuario
    async updateUser(req, res, next) {
        try {
            let data = req.body;
            console.log(data);
            // const updateUser = await Usuario.
        }catch (e) {
            console.log('ERROR: ', e);
            next(e);
        }
    }
}

module.exports = new RegisterController();