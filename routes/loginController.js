'use strict';
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class LoginController {
    // GET /login
    index(req, res, next) {
        res.locals.email = '';
        res.locals.error = '';
        res.render('login');
    }

    // POST /login
    async post(req, res, next) {
        try {
            const email = req.body.email;
            const password = req.body.password;

            const usuario = await Usuario.findOne({ email: email });
            console.log(usuario);

            if (!usuario ||!await bcrypt.compare(password, usuario.password)) {
                res.locals.email = email;
                res.locals.error = res.__('Usuario o contraseña incorrectos');
                res.render('login');
                return;
            }

            res.redirect('/');
        }catch (e) {
            console.log('ERROR: ', e);
            next(e);
        }
    }

    async loginJWT(req, res, next) {
        try {
        const email = req.body.email;
        const password = req.body.password;

        const usuario = await Usuario.findOne({ email: email });

            if (!usuario ||!await bcrypt.compare(password, usuario.password)) {
                await res.json({success: false, error: res.__('Usuario o contraseña incorrectos')});
                return;
            }

            const tocken = jwt.sign({ _id: usuario._id }, process.env.JWT_SECRET, {
                expiresIn: '1d'
            });

            res.json({success: true, tocken: tocken});

        } catch (e) {
            next(e);
        }
    }
}

module.exports = new LoginController();