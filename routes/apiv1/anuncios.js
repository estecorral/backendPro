'use strict';

const express = require('express');
const router = express.Router();

const Anuncio = require('../../models/Anuncio');
const jwtAuth = require('../../lib/jwtAuth');

/**
 *  GET /anuncios
 *  Devuelve la lista de anuncios, pudiendo limitar con ?limit=num
 */
router.get('/', jwtAuth(), async (req, res, next) => {
    try {
        const nombre = req.query.nombre;
        const tags = req.query.tag;
        const precio = req.query.precio;
        const venta = req.query.venta;
        const limit = parseInt(req.query.limit);
        const start = parseInt(req.query.start);
        const sort = req.query.sort;

        const filter = {};

      if(nombre) {
            filter.nombre = new RegExp('^' + nombre, "i");
        }
         if (tags) {
            filter.tags = {'$all': [tags]};
        }
        if (typeof precio !== 'undefined') {
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
        if(venta) {
            filter.venta = venta;
        }
        const anuncios = await Anuncio.list({filter: filter, limit, start, sort});
        res.json({ success: true, result: anuncios });
    }catch (e) {
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
       res.json({ success: true, result: tags });
   } catch (e) {
       next(e);
   }
});
/**
 *  POST /anuncios
 *  Añade un anuncio nuevo
 */
router.post('/', async (req, res, next) => {
   try {
       const data = req.body;

       const anuncio = new Anuncio(data);

       const anuncioGuardado = await anuncio.save();

       res.json({ success: true, result: anuncioGuardado });
   } catch (e) {
       next(e);
   }
});


module.exports = router;