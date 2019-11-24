'use strict';

const cote = require('cote');
const jimp = require('jimp');
const responder = new cote.Responder({ name: 'Thumnail Service' });

responder.on('transform', (req, done) => {
    jimp.read(req.path, (err, img) =>{
        if(err) {
            throw err;
        }
        img.resize(120, 120)
            .quality(80)
            .write(req.destination + `/${req.filename}_thumnail.jpg`);
    });
    console.log(req.destination, req.filename);
    done(req.destination, req.filename);
});