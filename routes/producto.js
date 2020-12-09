var express = require('express');
var mdAut = require('../middlewares/autenticacion');

var app = express();

var Producto = require('../models/producto');

//const usuario = require('../models/usuario');

//Obtener
app.get('/', function(req, res, next) {


    var desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec((err, productos) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar productos',
                    errors: err

                });
            }

            Producto.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    productos: productos,
                    total: conteo
                });

            });



        });


});


//actualizar

app.put('/:id', mdAut.verificarToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Producto.findById(id, (err, producto) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar los productos',
                errors: err

            });
        }
        if (!producto) {
            res.status(400).json({
                ok: false,
                mensaje: ' No existe el producto',
                errors: {
                    message: 'No existe el producto con ese id'
                }

            });
        }

        producto.nombre = body.nombre;
        producto.usuario = req.usuario._id;
        producto.categoria = body.categoria;
        producto.precioUni = body.precioUni;


        producto.save((err, productoRegistrado) => {

            if (err) {
                res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar producto',
                    errors: err

                });
            }

            res.status(200).json({
                ok: true,
                producto: productoRegistrado


            });


        });
    });


});

// Crear

app.post('/', mdAut.verificarToken, (req, res) => {

    var body = req.body;

    var producto = Producto({
        nombre: body.nombre,
        usuario: req.usuario._id,
        precioUni: body.precioUni,
        categoria: body.categoria
    });

    producto.save((err, productoRegistrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al registrar producto',
                errors: err

            });


        }

        res.status(201).json({
            ok: true,
            producto: productoRegistrado


        });

    });


});



//borrar

app.delete('/:id', mdAut.verificarToken, (req, res) => {

    var id = req.params.id;

    Producto.findByIdAndRemove(id, (err, ProductoEliminado) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar producto',
                errors: err

            });
        }
        if (!ProductoEliminado) {
            res.status(400).json({
                ok: false,
                mensaje: 'El producto no se encontro',
                errors: {
                    message: "El producto con ese id no se encontro"
                }

            });
        }


        res.status(200).json({
            ok: true,
            producto: ProductoEliminado


        });

    });


});
module.exports = app;