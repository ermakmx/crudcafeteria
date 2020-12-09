var express = require('express');
var mdAut = require('../middlewares/autenticacion');

var app = express();

var Categoria = require('../models/categoria');
const usuario = require('../models/usuario');

//Obtener
app.get('/', function(req, res, next) {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Categoria.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar categorias',
                    errors: err

                });
            }

            Categoria.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    categorias: categorias,
                    total: conteo

                });

            });


        });


});


//actualizar

app.put('/:id', mdAut.verificarToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;
    Categoria.findById(id, (err, categoria) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar las categorias',
                errors: err

            });
        }
        if (!categoria) {
            res.status(400).json({
                ok: false,
                mensaje: ' No existe la categoria',
                errors: {
                    message: 'No existe la categoria con ese id'
                }

            });
        }

        categoria.nombre = body.nombre;
        categoria.usuario = req.usuario._id;



        categoria.save((err, categoriaRegistrada) => {

            if (err) {
                res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar categoria',
                    errors: err

                });
            }

            res.status(200).json({
                ok: true,
                categoria: categoriaRegistrada


            });


        });
    });


});

// Crear

app.post('/', mdAut.verificarToken, (req, res) => {

    var body = req.body;

    var categoria = Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaRegistrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al registrar categoria',
                errors: err

            });


        }

        res.status(201).json({
            ok: true,
            categoria: categoriaRegistrada


        });

    });


});



//borrar

app.delete('/:id', mdAut.verificarToken, (req, res) => {

    var id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, CategoriaEliminada) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar categoria',
                errors: err

            });
        }
        if (!CategoriaEliminada) {
            res.status(400).json({
                ok: false,
                mensaje: 'La categoria no se encontro',
                errors: {
                    message: "La categoria con ese id no se encontro"
                }

            });
        }


        res.status(200).json({
            ok: true,
            categoria: CategoriaEliminada


        });

    });


});
module.exports = app;