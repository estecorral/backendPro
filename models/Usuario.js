'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// definimos un esquema
const usuarioSchema = mongoose.Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    favoritos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Anuncio'}],
}, { collection : 'usuarios' });

usuarioSchema.statics.hashPassword = function (plainPass) {
    return bcrypt.hash(plainPass, 10);
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;