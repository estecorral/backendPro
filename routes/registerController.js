'use strict';
const Usuario = require('../models/Usuario');
const Anuncio = require('../models/Anuncio');

class RegisterController {
    //POST new user data
    async postRegUser(req, res, next) {
        try{
            let data = req.body;
            const password = await Usuario.hashPassword(data.password);
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
            await Usuario.deleteOne({_id: userId});
            await Anuncio.deleteMany({autor: { _id: userId}});
            res.json({ success: true });
        } catch (e) {
            console.log('ERROR: ', e);
            next(e);
        }
    }

    //PUT actualizar datos usuario
    async updateUser(req, res, next) {
        try {
            const userId = req.param('id');
            const username = req.body.username;
            const email = req.body.email;
            const usuarioRegMail = await Usuario.findOne({ email: email });
            const usuarioRegUsername = await Usuario.findOne({ username: username});
            if (usuarioRegUsername) {
                if(typeof usuarioRegUsername._id !== userId) {
                    res.json({success: false, error: 'El username ya esta en uso'});
                    return;
                }
            }
            if (usuarioRegMail) {
                if(usuarioRegMail._id != userId) {
                    res.json({success: false, error: 'El email ya esta en uso'});
                    return;
                }
            }
            const usuario = await Usuario.findOneAndUpdate({_id: userId}, {username: username, email: email});
            res.json({success: true, result: usuario});
        }catch (e) {
            console.log('ERROR: ', e);
            next(e);
        }
    }

    //PUT actualiza favoritos usuario
    async favorites(req, res, next) {
        try {
            const anuncio = req.body;
            const userId = req.param('id');
            await Usuario.update({_id: userId}, {$push: {favoritos: anuncio._id}});
            const favs = await Usuario.findOne({_id:userId}).populate('favoritos').exec();
            res.json({success: true, favorites: favs});
        }catch (e) {
            console.log('ERROR: ', e);
            next(e);
        }
    }

    //GET recupera los favoritos de un usuario registrado
    async getAllFavs(req, res, next) {
        try {
            const userId = req.param('id');
            const favs = await Usuario.findOne({_id:userId}).populate('favoritos').exec();
            res.json({success: true, favorites: favs});
        }catch (e) {
            console.log('ERROR: ', e);
            next(e);
        }
    }

    //DELETE favorite de un usuario
    async deleteFavorite(req, res, next) {
        console.log('delete');
        try {
            const anuncio = req.body;
            const userId = req.param('id');
            await Usuario.updateOne({_id: userId}, {$pull: {favoritos: anuncio._id}});
            const favs = await Usuario.findOne({_id:userId}).populate('favoritos').exec();
            res.json({success: true, favorites: favs});
        }catch (e) {
            console.log('ERROR: ', e);
            next(e);
        }
    }

    //UPDATE actualiza la contraseña de un usuario
    async updatePassword(req, res, next) {
        try {
            const email = req.body.email;
            const password = await Usuario.hashPassword(req.body.password);
            console.log(email, password);
            await Usuario.update({email: email}, {password: password});
            res.json({success: true});
        }catch (e) {
            console.log('ERROR: ', e);
            next(e);
        }
    }
}


module.exports = new RegisterController();