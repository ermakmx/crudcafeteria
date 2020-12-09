var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var app = express();
var SEED = require('../config/config').SEED;

var Usuario = require('../models/usuario');

app.post('/', (req, res) => {



    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {



        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error no se encuentra el usuario',
                errors: err

            });
        }

        if (!usuarioDB) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err

            });

        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err

            });
        }
        usuarioDB.password = 'o_o';
        //token

        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });



        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB.id


        });

    });




});






module.exports = app;