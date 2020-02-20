'use strict';

const mongoose = require('mongoose');

// definimos un esquema
const anuncioSchema = mongoose.Schema({
    nombre: { type: String, index: true },
    venta: Boolean,
    precio: { type: Number, index: true },
    descripcion: String,
    foto: String,
    tags: [String],
    usuario: String,
    date: Date,
    vendido: Boolean,
    reservado: Boolean,
    autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection : 'anuncios' });



anuncioSchema.statics.list = function ({filter, limit, start, sort}) {
    const query = Anuncio.find(filter).populate('autor', 'username');
    query.limit(limit);
    query.skip(start);
    console.log(sort);
    if (!sort) {
        query.sort({date: -1});
    } else {
        query.sort(sort);
    }
    return query.exec();
};

anuncioSchema.statics.getAd = function (id) {
    const query = Anuncio.find(id).populate('autor', 'username').exec();
    return query.exec();
};

// Modelo de anuncio
const Anuncio = mongoose.model('Anuncio', anuncioSchema);

module.exports = Anuncio;