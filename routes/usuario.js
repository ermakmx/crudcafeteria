var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAut = require('../middlewares/autenticacion');



// var SEED = require('../config/config').SEED;
var app = express();

var Usuario = require('../models/usuario');

//Obtener
app.get('/', function(req, res, next) {

    Usuario.find({}, 'nombre email img role').exec((err, usuarios) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al cargar usuarios',
                errors: err

            });
        }

        res.status(200).json({
            ok: true,
            usuarios: usuarios

        });

    });


});


//actualizar

app.put('/:id', mdAut.verificarToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;
    Usuario.findById(id, (err, usuario) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err

            });
        }
        if (!usuario) {
            res.status(400).json({
                ok: false,
                mensaje: ' No existe el usuario',
                errors: {
                    message: 'No existe el usuario con ese id'
                }

            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;


        usuario.save((err, usuarioRegistrado) => {

            if (err) {
                res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err

                });
            }
            usuarioRegistrado.password = 'o_o';
            res.status(200).json({
                ok: true,
                usuario: usuarioRegistrado


            });


        });
    });


});

// Crear

app.post('/', mdAut.verificarToken, (req, res) => {

    var body = req.body;

    var usuario = Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioregistrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al registrar usuario',
                errors: err

            });


        }

        res.status(201).json({
            ok: true,
            usuario: usuarioregistrado


        });

    });


});




//borrar

app.delete('/:id', mdAut.verificarToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err

            });
        }
        if (!usuarioEliminado) {
            res.status(400).json({
                ok: false,
                mensaje: 'El usuario no se encontro',
                errors: {
                    message: "El usuario con ese id no se encontro"
                }

            });
        }

        usuarioEliminado.password = 'o_o';
        res.status(200).json({
            ok: true,
            usuario: usuarioEliminado


        });

    });


});
module.exports = app;