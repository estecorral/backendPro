'use strict';
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class LoginController {
    // GET /login
    index(req, res, next) {
        res.locals.username = '';
        res.locals.email = '';
        res.locals.error = '';
        res.render('login');
    }

    async loginJWT(req, res, next) {
        try {
            const username = req.body.username;
            const password = req.body.password;

            const usuario = await Usuario.findOne({ username: username });

            if (!usuario ||!await bcrypt.compare(password, usuario.password)) {
                await res.json({success: false, error: res.__('Usuario o contraseña incorrectos')});
                return;
            }

            const tocken = jwt.sign({ _id: usuario._id }, process.env.JWT_SECRET, {
                expiresIn: '1d'
            });

            await res.json({success: true, tocken: tocken});

        } catch (e) {
            next(e);
        }
    }
}

module.exports = new LoginController();