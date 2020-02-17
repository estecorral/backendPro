'use strict';
const nodemailer = require('nodemailer');
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

class MailController {
    // POST reset password
    async resetPassword(req, res, next) {
        try {
        const email = req.body.email;
        const usuario = await Usuario.findOne({ email: email });
        if(!usuario) {
            res.json({success: false, error: 'No existe ningun usuario registrado con ese email'});
            return;
        }
            const token = jwt.sign({ _id: usuario._id }, process.env.JWT_SECRET, {

                expiresIn: '1h'
            });

        res.json({success: true, result: 'Se ha enviado el mail a su cuenta de correo: ' + email});
        }catch (e) {
            console.log('ERROR: ', e);
            next(e);
        }
    }
}

module.exports = new MailController();