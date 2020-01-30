'use strict';
const Usuario = require('../models/Usuario');

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
                res.json({ success: true, result: regUser });
        }catch (e) {
            console.log('ERROR: ', e);
            next(e);
        }
    }
}

module.exports = new RegisterController();