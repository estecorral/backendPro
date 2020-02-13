'use strict';

const cote = require('cote');
const jimp = require('jimp');
const responder = new cote.Responder({ name: 'Thumnail Service' });

responder.on('transform', (req, done) => {
    jimp.read(req.path, (err, img) =>{
        if(err) {
            throw err;
        }
        img.scaleToFit(100, 100)
            .quality(90)
            .write(req.destination + `/${req.filename}_thumnail.jpg`);
    });
});