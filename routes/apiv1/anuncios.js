'use strict';

const express = require('express');
const router = express.Router();
const cote = require('cote');

const Anuncio = require('../../models/Anuncio');
const jwtAuth = require('../../lib/jwtAuth');

const requester = new cote.Requester({ name: 'Client' });
/**
 *  GET /anuncios
 *  Devuelve la lista de anuncios, pudiendo limitar con ?limit=num
 */
router.get('/', async (req, res, next) => {
    try {
        const nombre = req.query.nombre;
        const usuario =  req.query.usuario;
        const tags = req.query.tag;
        const precio = req.query.precio;
        const venta = req.query.venta;
        const limit = parseInt(req.query.limit);
        const start = parseInt(req.query.start);
        const sort = req.query.sort;

        const filter = {};

        if(usuario) {
            filter.usuario = usuario;
        }

        if(nombre) {
            filter.nombre = new RegExp('^' + nombre, "i");
        }
        if (tags) {
            if (tags !== 'all') {
                filter.tags = {'$all': [tags]};
            }
        }
        if (typeof precio !== 'undefined') {
            if (precio !== '') {
                if (precio[0] === '-') {
                    filter.precio = {'$lte': Math.abs(parseInt(precio))};
                } else if (precio[precio.length - 1] === '-'){
                    filter.precio = {'$gte': parseInt(precio)};
                } else if (precio.indexOf('-') > 0 && precio.indexOf('-') < precio.length - 1){
                    let precio1 = precio.substring(0, precio.indexOf('-'));
                    let precio2 = precio.substring(precio.indexOf('-') + 1 , precio.length);
                    filter.precio = {'$gte': parseInt(precio1), '$lte': parseInt(precio2)};
                } else {
                    filter.precio = precio;
                }
            }
        }
        if(typeof venta !== 'undefined') {
            if (venta !== '') {
                filter.venta = venta;
            }
        }
        const anuncios = await Anuncio.list({filter: filter, limit, start, sort});
        // const count = await Anuncio.list({filter: filter});
        res.json({ success: true, result: anuncios});
    }catch (e) {
        next(e);
    }
});

/**
 * GET /:id
 * Recupera un anuncios por el id
 */
router.get('/:id', async (req, res, next) => {
    try {
        const id = req.param('id');
        const ad = await Anuncio.findById(id).populate('autor', 'username');
        await res.json({ success: true, result: ad });
    } catch (e) {
        next(e);
    }
});

/**
 * GET /tags
 * Muestra listado de los diferentes tags
 */

router.get('/tags', async (req, res, next) => {
   try {
       const tags = await Anuncio.distinct('tags').exec();
       await res.json({ success: true, result: tags });
   } catch (e) {
       next(e);
   }
});
/**
 *  POST /anuncios
 *  Añade un anuncio nuevo
 */
router.post('/',jwtAuth(), async (req, res, next) => {
    try {
      const data = req.body;
      data.date = new Date();
      data.foto = req.file.filename;
      const anuncio = new Anuncio(data);

    requester.send({
           type: 'transform',
           filename: req.file.filename,
           path: req.file.path,
           destination: req.file.destination
       });

       const anuncioGuardado = await anuncio.save();

       res.json({ success: true, result: anuncioGuardado });
   } catch (e) {
       next(e);
   }
});

/**
 *  /anuncios/delete/:id
 *  Delete Anuncio
 */
router.delete('/delete/:id', jwtAuth(), async (req, res, next) => {
    try {
        const adId = req.param('id');
        await Anuncio.deleteOne({_id: adId});
        res.json({ success: true });
    } catch (e) {
        console.log('ERROR: ', e);
        next(e);
    }
});

/**
 * /anuncios/update
 * update anuncio
 */
router.put('/update/:id', jwtAuth(), async (req, res, next) => {
   try {
       const adId = req.param('id');
       const ad = req.body;
       let tags = [];
       req.body.tags.map(tag => {
            tags.push(tag.value);
       });
       await Anuncio.findByIdAndUpdate(adId,
           {
               nombre: ad.nombre,
               descripcion: ad.descripcion,
               precio: ad.precio,
               tags: tags,
               venta: ad.venta.value,
                });
       res.json({ success: true });
   } catch (e) {
       console.log('ERROR: ', e);
       next(e);
   }
});

/**
 * update anucio como vendido/comprado
 */
router.put('/update/vendido/:id', jwtAuth(), async (req, res, next) => {
    try{
        const id = req.param('id');
        const vendido = req.body.vendido;
        const ad = await Anuncio.findOneAndUpdate({ _id: id}, {vendido: vendido});
        const ads = await Anuncio.find({autor: ad.autor._id}).populate('autor', 'username');
        ads.reverse();
        res.json({ success: true, ads: ads });
    } catch (e) {
        console.log('ERROR: ', e);
        next(e);
    }
});

/**
 * update anucio como reservado
 */
router.put('/update/reservado/:id', jwtAuth(), async (req, res, next) => {
    try{
        const id = req.param('id');
        const reservado = req.body.reservado;
        const ad = await Anuncio.findOneAndUpdate({ _id: id}, {reservado: reservado});
        const ads = await Anuncio.find({autor: ad.autor._id}).populate('autor', 'username');
        ads.reverse();
        res.json({ success: true, ads: ads });
    } catch (e) {
        console.log('ERROR: ', e);
        next(e);
    }
});

module.exports = router;