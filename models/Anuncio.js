'use strict';

const mongoose = require('mongoose');

// definimos un esquema
const anuncioSchema = mongoose.Schema({
    nombre: { type: String, index: true },
    venta: { type: Boolean, index: true },
    precio: { type: Number, index: true },
    descripcion: String,
    foto: String,
    tags: { type: [String], index: true }
}, { collection : 'anuncios' });



anuncioSchema.statics.list = function ({filter, limit, start, sort}) {
    const query = Anuncio.find(filter);
    console.log(filter);
    query.limit(limit);
    query.skip(start);
    query.sort(sort);
    return query.exec();
}

// Modelo de anuncio
const Anuncio = mongoose.model('Anuncio', anuncioSchema);

module.exports = Anuncio;