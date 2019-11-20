'use strict';

const conn = require('./lib/connectMongoose');

const Anuncio = require('./models/Anuncio');
const Usuario = require('./models/Usuario');

const datosAnuncios = require('./data/anuncios.json');

conn.once('open', async () => {
    try {
        await Anuncio.deleteMany();
        await Anuncio.insertMany(datosAnuncios.anuncios);
        await initUsuarios();
        await conn.close();
    } catch (e) {
        console.log('Error!:', e);
    }

});

async function initUsuarios() {
    await Usuario.deleteMany();
    await Usuario.insertMany([
        {
            email: 'admin@example.com',
            password: await Usuario.hashPassword('1234')
        }
    ]);
}