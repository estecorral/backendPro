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
            var transport = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: "5b0876c28dedf6",
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: 'no-reply@wallakeep.es',
                to: `${email}`,
                subject: 'Enlace de recuperación de contraseña',
                text:
                'Hola.\n'
                + 'Has recibido este email por una solicitud de recuperación de contraseña\n\n'
                + 'Accede al siguiente link si deseas actualizar tu contraseña:\n\n'
                + `http://localhost:3002/reset/${email}/${token}\n\n`
                + 'Si no has realizado esta solicitud, ignora este email. \n',
            };
           transport.sendMail(mailOptions, async (e, response) => {
                if (e) {
                    console.error('Se ha producido un error', e);
                } else {
                    res.json({success: true,
                        result: 'Se ha enviado el mail a su cuenta de correo: ' + email,
                        response: response});
                }
            });
        }catch (e) {
            console.log('ERROR: ', e);
            next(e);
        }
    }
}

module.exports = new MailController();